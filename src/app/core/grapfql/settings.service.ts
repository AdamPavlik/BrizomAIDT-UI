import {Injectable} from '@angular/core';
import {ApolloClient} from '@apollo/client/core';
import {AppSyncService} from './app-sync.service';
import {ADD_SETTING, GET_SETTING, UPDATE_SETTING} from './queries';
import {BehaviorSubject, distinctUntilChanged} from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private setting = new BehaviorSubject<Setting>({});
  private settingObservable = this.setting.asObservable()
    .pipe(distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)));


  public apollo: ApolloClient<any>;

  constructor(private appSync: AppSyncService, private authService: AuthService) {
    this.apollo = appSync.getApollo();
    this.fetchSetting();
  }

  getSetting() {
    return this.settingObservable;
  }

  async updateSetting(setting: Setting): Promise<Boolean> {
    const currentSetting = this.setting.getValue();
    if (setting.generateSignals) {
      currentSetting.startTime = setting.startTime;
    }
    if (setting.sendEmails) {
      currentSetting.sendEmails = setting.sendEmails;
    }
    if (setting.executeOrders) {
      currentSetting.executeOrders = setting.executeOrders;
    }
    if (setting.aiModel) {
      currentSetting.aiModel = setting.aiModel;
    }
    if (setting.effort) {
      currentSetting.effort = setting.effort;
    }
    if (setting.maxTokens) {
      currentSetting.maxTokens = setting.maxTokens;
    }
    if (setting.startTime) {
      currentSetting.startTime = setting.startTime;
    }
    if (setting.includeLiveData) {
      currentSetting.includeLiveData = setting.includeLiveData;
    }
    if (setting.includeBalances) {
      currentSetting.includeBalances = setting.includeBalances;
    }
    if (setting.stableCoin) {
      currentSetting.stableCoin = setting.stableCoin;
    }
    if (setting.onHoldAction) {
      currentSetting.onHoldAction = setting.onHoldAction;
    }
    if (setting.confidenceToBuy) {
      currentSetting.confidenceToBuy = setting.confidenceToBuy;
    }
    if (setting.confidenceToSell) {
      currentSetting.confidenceToSell = setting.confidenceToSell;
    }
    this.setting.next(currentSetting);

    const {data} = await this.apollo.mutate<{ updateSetting: Boolean }, { input: Setting }>({
      mutation: UPDATE_SETTING,
      variables: {input: setting}
    });
    return data!.updateSetting
  }


  private fetchSetting() {
    this.apollo.query<{ getSetting: Setting; }>({query: GET_SETTING}).then(({data}) => {
      if (data.getSetting != null) {
        this.setting.next(Object.assign({}, data.getSetting));
      } else {
        this.createNewSetting().then(setting => this.setting.next(Object.assign({}, setting)))
      }
    });
  }

  private async createNewSetting(): Promise<Setting> {
    let {data} = await this.apollo.mutate<{ addSetting: Setting }, { input: Setting }>({
      mutation: ADD_SETTING,
      variables: {input: {email: this.authService.getCurrentUser().email}}
    });
    return data!.addSetting;
  }

}

export interface Setting {
  userId?: string;
  sendEmails?: boolean;
  generateSignals?: boolean;
  executeOrders?: boolean;
  aiProvider?: string;
  aiModel?: string;
  effort?: string;
  maxTokens?: number;
  startTime?: number;
  email?: string;
  stableCoin?: string;
  onHoldAction?: string;
  confidenceToBuy?: number;
  confidenceToSell?: number;
  includeBalances?: boolean;
  includeLiveData?: boolean;
}
