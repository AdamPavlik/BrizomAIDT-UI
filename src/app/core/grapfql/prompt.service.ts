import {Injectable} from '@angular/core';
import {AppSyncService} from './app-sync.service';
import {ApolloClient} from '@apollo/client/core';
import {ADD_PROMPT, DELETE_PROMPT, GET_PROMPTS, UPDATE_PROMPT} from './queries';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  private prompts = new BehaviorSubject<Prompt[]>([]);
  private promptsObservable = this.prompts.asObservable();

  public apollo: ApolloClient<any>;

  constructor(private appSync: AppSyncService) {
    this.apollo = appSync.getApollo();
    this.fetchPrompts();
  }

  public fetchPrompts() {
    this.apollo.query<{ getPrompts: Prompt[]; }>({query: GET_PROMPTS}).then(({data}) => {
      this.prompts.next((data.getPrompts ?? []).map(p => ({...p})));
    });
  }

  getPrompts(): Observable<Prompt[]> {
    return this.promptsObservable;
  }

  async addPrompt(prompt: Prompt): Promise<Prompt> {
    const input: Prompt = {
      role: prompt.role,
      prompt: prompt.prompt,
      enabled: prompt.enabled,
    };
    const {data} = await this.apollo.mutate<{ addPrompt: Prompt }, { input: Prompt }>({
      mutation: ADD_PROMPT,
      variables: {input: input}
    });

    const newPromptWithId = data!.addPrompt;
    const currentPrompts = this.prompts.getValue();
    this.prompts.next([...currentPrompts, newPromptWithId]);

    return newPromptWithId;
  }

  async deletePrompt(id: string): Promise<Boolean> {
    const currentPrompts = this.prompts.getValue();
    const updatedPrompts = currentPrompts.filter(p => p.id !== id);
    this.prompts.next(updatedPrompts);

    const {data} = await this.apollo.mutate<{ deletePrompt: Boolean }, { input: {id: string} }>({
      mutation: DELETE_PROMPT,
      variables: {input: {id: id}}
    });
    return data!.deletePrompt
  }

  async updatePrompt(prompt: Prompt): Promise<Boolean> {
    const input: Prompt = {
      id: prompt.id,
      role: prompt.role,
      enabled: prompt.enabled,
      prompt: prompt.prompt
    };

    const currentPrompts = this.prompts.getValue();
    const updatedPrompts = currentPrompts.map(p => p.id === prompt.id ? {...prompt} : p);
    this.prompts.next(updatedPrompts);

    const {data} = await this.apollo.mutate<{ updatePrompt: Boolean }, { input: Prompt }>({
      mutation: UPDATE_PROMPT,
      variables: {input: input}
    });
    return data!.updatePrompt
  }


}


export interface Prompt {
  id?: string;
  userId?: string;
  role: string;
  prompt: string;
  enabled: boolean;
}
