import {Injectable} from '@angular/core';
import {AppSyncService} from './app-sync.service';
import {GET_SIGNALS} from './queries';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignalService {

  constructor(private appSync: AppSyncService, private authService: AuthService) {
  }

  async getSignals() {
    if (!this.authService.isAuthenticated()) {
      return [];
    }
    let data = await this.appSync.getApollo().query<{ getSignals: Signal[]; }>({query: GET_SIGNALS})
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
