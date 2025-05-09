import {Injectable} from '@angular/core';
import {ADD_COIN, DELETE_COIN, GET_COINS, UPDATE_COIN} from './queries';
import {AppSyncService} from './app-sync.service';
import {ApolloClient} from '@apollo/client/core';

@Injectable({
  providedIn: 'root'
})
export class CoinService {

  public apollo: ApolloClient<any>;

  constructor(private appSync: AppSyncService) {
    this.apollo = appSync.getApollo();
  }

  async getCoins(): Promise<Coin[]> {
    const {data} = await this.apollo.query<{ getCoins: Coin[]; }>({query: GET_COINS});
    return (data.getCoins ?? []).map(c => ({...c}));
  }

  async updateCoin(coin: Coin): Promise<Boolean> {
    const input: Coin = {
      id: coin.id,
      symbol: coin.symbol,
      executeOrder: coin.executeOrder,
      generateSignal: coin.generateSignal,
      sendEmail: coin.sendEmail
    };
    const {data} = await this.apollo.mutate<{ updateCoin: Boolean }, { input: Coin }>({
      mutation: UPDATE_COIN,
      variables: {input: input}
    });
    return data!.updateCoin
  }

  async addCoin(coin: Coin): Promise<Coin> {
    const input: Coin = {
      symbol: coin.symbol,
      executeOrder: coin.executeOrder,
      generateSignal: coin.generateSignal,
      sendEmail: coin.sendEmail
    };
    const {data} = await this.apollo.mutate<{ addCoin: Coin }, { input: Coin }>({
      mutation: ADD_COIN,
      variables: {input: input}
    });
    return data!.addCoin
  }

  async deleteCoin(id: string): Promise<Boolean> {
    const {data} = await this.apollo.mutate<{ deleteCoin: Boolean }, { input: {id: string} }>({
      mutation: DELETE_COIN,
      variables: {input: {id: id}}
    });
    return data!.deleteCoin
  }

}

export interface Coin {
  id?: string;
  symbol: string;
  userId?: string
  executeOrder: Boolean;
  generateSignal: Boolean;
  sendEmail: Boolean;
}
