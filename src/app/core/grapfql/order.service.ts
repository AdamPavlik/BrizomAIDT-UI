import {Injectable} from '@angular/core';
import {AppSyncService} from './app-sync.service';
import {GET_ORDERS} from './queries';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(private appSync: AppSyncService, private authService: AuthService) {
  }

  async getOrders() {
    if (!this.authService.isAuthenticated()) {
      return [];
    }
    let data = await this.appSync.getApollo().query<{ getOrders: Order[]; }>({query: GET_ORDERS})
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
