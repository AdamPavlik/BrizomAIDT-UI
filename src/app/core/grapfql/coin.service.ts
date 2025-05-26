import {Injectable} from '@angular/core';
import {ADD_COIN, DELETE_COIN, GET_COINS, UPDATE_COIN} from './queries';
import {AppSyncService} from './app-sync.service';
import {BehaviorSubject, distinctUntilChanged, Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CoinService {

  private coins = new BehaviorSubject<Coin[]>([]);
  private coinsObservable = this.coins.asObservable()
    .pipe(distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)));


  constructor(private appSync: AppSyncService, private authService: AuthService) {
    if (authService.isAuthenticated()) {
      this.fetchCoins();
    }
  }

  public fetchCoins() {
    this.appSync.getApollo().query<{ getCoins: Coin[]; }>({query: GET_COINS}).then(({data}) => {
      this.coins.next((data.getCoins ?? []).map(c => ({...c})));
    });
  }

  getCoins(): Observable<Coin[]> {
    return this.coinsObservable;
  }


  async updateCoin(coin: Coin): Promise<Boolean> {
    const input: Coin = {
      id: coin.id,
      symbol: coin.symbol,
      executeOrder: coin.executeOrder,
      generateSignal: coin.generateSignal,
      sendEmail: coin.sendEmail
    };
    const currentCoins = this.coins.getValue();
    const updatedCoins = currentCoins.map(c => c.id === coin.id ? {...coin} : c);
    this.coins.next(updatedCoins);

    const {data} = await this.appSync.getApollo().mutate<{ updateCoin: Boolean }, { input: Coin }>({
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

    const {data} = await this.appSync.getApollo().mutate<{ addCoin: Coin }, { input: Coin }>({
      mutation: ADD_COIN,
      variables: {input: input}
    });

    const newCoinWithId = data!.addCoin;
    const currentCoins = this.coins.getValue();
    this.coins.next([...currentCoins, newCoinWithId]);

    return newCoinWithId;
  }

  async deleteCoin(id: string): Promise<Boolean> {
    const currentCoins = this.coins.getValue();
    const updatedCoins = currentCoins.filter(c => c.id !== id);
    this.coins.next(updatedCoins);

    const {data} = await this.appSync.getApollo().mutate<{ deleteCoin: Boolean }, { input: {id: string} }>({
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
