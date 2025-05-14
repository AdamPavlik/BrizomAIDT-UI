import {Component, DestroyRef, HostListener, OnInit} from '@angular/core';
import {Coin, CoinService} from '../../core/grapfql/coin.service';
import {Prompt, PromptService} from '../../core/grapfql/prompt.service';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../core/auth/auth.service';
import {NgForOf, NgIf} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatTableModule
} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Setting, SettingsService} from '../../core/grapfql/settings.service';
import {CredentialsService} from '../../core/grapfql/credentials.service';
import {MatListModule} from '@angular/material/list';
import {Order, OrderService} from '../../core/grapfql/order.service';
import {Signal, SignalService} from '../../core/grapfql/signal.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatGridList,
    MatGridTile,
    MatCardModule,
    MatButton,
    RouterLink,
    NgIf,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatTableModule,
    MatIconModule,
    MatListModule,
    NgForOf,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  coinColumns = [
    'symbol',
    'generateSignal',
    'sendEmail',
    'executeOrder',
  ];

  promptColumns = [
    'role',
    'enabled',
    'prompt',
  ];


  public cols = 2;

  public coins: Coin[] = [];
  public prompts: Prompt[] = [];
  public setting: Setting = {};
  public orders: Order[] = [];
  public signals: Signal[] = [];
  public credentials: boolean = false;

  constructor(private coinService: CoinService,
              private promptService: PromptService,
              private settingService: SettingsService,
              private authService: AuthService,
              private credentialsService: CredentialsService,
              private orderService: OrderService,
              private signalService: SignalService,
              private destroyRef: DestroyRef) {
    this.updateCols();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.coinService.getCoins().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(coins => {
        this.coins = coins;
      });
      this.promptService.getPrompts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(prompts => {
        this.prompts = prompts;
      });
      this.settingService.getSetting().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(setting => {
        this.setting = setting;
      });
      this.credentialsService.isCredentialsExists().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(credentials => {
        this.credentials = credentials;
      });
      this.orderService.getOrders().then(value => this.orders = value);
      this.signalService.getSignals().then(value => this.signals = value);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.updateCols();
  }

  private updateCols() {
    let w = window.innerWidth;
    if (w > 600) {
      w -= 247;
    }
    if (w < 800) {
      this.cols = 1;
    } else  {
      this.cols = 2;
    }
  }


  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  formatStartTime(minutes?: number): string {
    if (minutes === undefined) {
      return 'Not set';
    }
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCMinutes(minutes);
    const localHours = date.getHours();
    const localMinutes = date.getMinutes();

    return `${localHours.toString().padStart(2, '0')}:${localMinutes.toString().padStart(2, '0')}`;
  }

}
