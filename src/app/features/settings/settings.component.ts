import {Component, DestroyRef} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatInputModule} from '@angular/material/input';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {Setting, SettingsService} from '../../core/grapfql/settings.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {Credentials, CredentialsService} from '../../core/grapfql/credentials.service';


@Component({
  selector: 'app-settings',
  imports: [
    MatCardModule,
    MatListModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatSliderModule,
    MatTimepickerModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
],
  providers: [provideNativeDateAdapter()],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private currentMaxTokens = 32000;
  private currentConfidenceToSell = 50;
  private currentConfidenceToBuy = 50;
  private balanceUtilization = 100;
  public setting: Setting = {};
  public startTime = new Date(0, 0, 0, 0, 0, 0);
  public isCredentialsExists = false;


  constructor(private settingService: SettingsService, private credentialsService: CredentialsService, private destroyRef: DestroyRef) {
    settingService.getSetting()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.setting = value;
        this.currentMaxTokens = value.maxTokens!;
        this.currentConfidenceToSell = value.confidenceToSell!;
        this.currentConfidenceToBuy = value.confidenceToBuy!;
        this.balanceUtilization = value.balanceUtilization!;
        this.startTime = this.mapTime(value.startTime!)
      });
    this.credentialsService.isCredentialsExists()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.isCredentialsExists = value;
      });
  }


  private mapTime(minsUTC: number): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const offset = date.getTimezoneOffset();
    const localMins = minsUTC - offset;
    date.setMinutes(localMins);
    return date;
  }

  addCredentials(binanceKey: string, binanceSecret: string) {
    const credentials: Credentials = {
      binanceKey: binanceKey,
      binanceSecretKey: binanceSecret
    }
    this.credentialsService.addCredentials(credentials);
  }

  deleteCredentials() {
    const settings: Setting = {executeOrders: false};
    this.settingService.updateSetting(settings).then();
    this.credentialsService.deleteCredentials();
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }

  updateGenerateSignals(enabled: boolean) {
    const settings: Setting = {generateSignals: enabled};
    this.settingService.updateSetting(settings).then();
  }

  updateSendEmails(enabled: boolean) {
    const settings: Setting = {sendEmails: enabled};
    this.settingService.updateSetting(settings).then();
  }

  updateExecuteOrders(enabled: boolean) {
    const settings: Setting = {executeOrders: enabled};
    this.settingService.updateSetting(settings).then();
  }

  updateAiModel(model: string) {
    const settings: Setting = {aiModel: model};
    this.settingService.updateSetting(settings).then();
  }

  updateStableCoin(coin: string) {
    const settings: Setting = {stableCoin: coin};
    this.settingService.updateSetting(settings).then();
  }

  updateOnHoldAction(action: string) {
    const settings: Setting = {onHoldAction: action};
    this.settingService.updateSetting(settings).then();
  }

  updateConfidenceToBuy(confidence: number) {
    if (this.currentConfidenceToBuy !== confidence) {
      this.currentConfidenceToBuy = confidence;
      const settings: Setting = {confidenceToBuy: confidence};
      this.settingService.updateSetting(settings).then();
    }
  }

  updateConfidenceToSell(confidence: number) {
    if (this.currentConfidenceToSell !== confidence) {
      this.currentConfidenceToSell = confidence;
      const settings: Setting = {confidenceToSell: confidence};
      this.settingService.updateSetting(settings).then();
    }
  }

  updateEffort(effort: string) {
    const settings: Setting = {effort: effort};
    this.settingService.updateSetting(settings).then();
  }

  updateMaxTokens(maxTokens: number) {
    if (this.currentMaxTokens !== maxTokens) {
      this.currentMaxTokens = maxTokens;
      const settings: Setting = {maxTokens: maxTokens};
      this.settingService.updateSetting(settings).then();
    }
  }

  updateStartTime(startTimeDate: string) {
    const date = new Date(startTimeDate);
    const minsUTC = date.getUTCHours() * 60 + date.getUTCMinutes();
    const settings: Setting = {startTime: minsUTC};
    this.settingService.updateSetting(settings).then();
  }

  updateIncludeBalances(includeBalances: boolean) {
    const settings: Setting = {includeBalances: includeBalances};
    this.settingService.updateSetting(settings).then();
  }

  updateIncludeLiveData(includeLiveData: boolean) {
    const settings: Setting = {includeLiveData: includeLiveData};
    this.settingService.updateSetting(settings).then();
  }

  updateBalanceUtilization(balanceUtilization: number) {
    if (this.balanceUtilization !== balanceUtilization) {
      this.balanceUtilization = balanceUtilization;
      const settings: Setting = {balanceUtilization: balanceUtilization};
      this.settingService.updateSetting(settings).then();
    }
  }


}
