import {Injectable} from '@angular/core';
import {AppSyncService} from './app-sync.service';
import {ApolloClient} from '@apollo/client/core';
import {ADD_PROMPT, DELETE_PROMPT, GET_PROMPTS, UPDATE_PROMPT} from './queries';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  public apollo: ApolloClient<any>;

  constructor(private appSync: AppSyncService) {
    this.apollo = appSync.getApollo();
  }

  async getPrompts(): Promise<Prompt[]> {
    const {data} = await this.apollo.query<{ getPrompts: Prompt[]; }>({query: GET_PROMPTS});
    return (data.getPrompts ?? []).map(c => ({...c}));
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
    return data!.addPrompt
  }

  async deletePrompt(id: string): Promise<Boolean> {
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
