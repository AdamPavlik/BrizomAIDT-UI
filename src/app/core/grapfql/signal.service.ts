import {Injectable} from '@angular/core';
import {ApolloClient} from '@apollo/client/core';
import {AppSyncService} from './app-sync.service';
import {GET_SIGNALS} from './queries';

@Injectable({
  providedIn: 'root'
})
export class SignalService {

  public apollo: ApolloClient<any>;

  constructor(private appSync: AppSyncService) {
    this.apollo = appSync.getApollo();
  }

  async getSignals() {
    let data = await this.apollo.query<{ getSignals: Signal[]; }>({query: GET_SIGNALS})
    return data.data.getSignals;
  }

}


export interface Signal {
  id: string,
  userId: string,
  coin: string,
  action: string,
  confidence: number
  date: string
  reason: string
}
