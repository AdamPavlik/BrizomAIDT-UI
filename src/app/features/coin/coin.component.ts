import {Component, DestroyRef, OnInit} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {COINS_LIST} from './coins';

import {MatFormFieldModule} from '@angular/material/form-field';
import {Coin, CoinService} from '../../core/grapfql/coin.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-coin',
  imports: [
    FormsModule,
    MatTableModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule
],
  templateUrl: './coin.component.html',
  styleUrl: './coin.component.scss',
})
export class CoinComponent implements OnInit {

  public coins: Coin[] = [];
  public availableCoins: string[] = [];

  displayedColumns = [
    'symbol',
    'generateSignal',
    'sendEmail',
    'executeOrder',
    'delete'
  ];

  constructor(private coinService: CoinService, private destroyRef: DestroyRef) {
  }

  ngOnInit(): void {
    this.coinService.getCoins()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(coins => {
        this.coins = coins
        this.availableCoins = COINS_LIST.filter(availableCoin => !this.coins.find(existingCoin => existingCoin.symbol === availableCoin));
      });
  }

  updateCoin(coin: Coin) {
    this.coinService.updateCoin(coin).then();
  }

  addCoin(coin: string): void {
    const newCoin: Coin = {
      symbol: coin,
      generateSignal: false,
      sendEmail: false,
      executeOrder: false,
    }
    this.coinService.addCoin(newCoin).then();
  }

  deleteCoin(coin: Coin): void {
    this.coinService.deleteCoin(coin.id!).then();
  }

}
