import {Injectable} from '@angular/core';
import {ApolloClient} from '@apollo/client/core';
import {AppSyncService} from './app-sync.service';
import {GET_ORDERS} from './queries';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public apollo: ApolloClient<any>;

  constructor(private appSync: AppSyncService) {
    this.apollo = appSync.getApollo();
  }

  async getOrders() {
    let data = await this.apollo.query<{ getOrders: Order[]; }>({query: GET_ORDERS})
    return data.data.getOrders;
  }

}

export interface Order {
  id: string,
  userId: string,
  date: string,
  quantity: string,
  quoteOrderQty: string,
  side: string,
  symbol: string
}
