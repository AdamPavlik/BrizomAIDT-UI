import {Injectable} from '@angular/core';
import {AppSyncService} from './app-sync.service';
import {ApolloClient} from '@apollo/client/core';
import {GET_PROMPTS} from './queries';

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
}


export interface Prompt {
  id: string;
  userId: string;
  role: string;
  prompt: string;
  enabled: boolean;
}
