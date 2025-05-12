import {Component, DestroyRef, HostListener, OnInit} from '@angular/core';
import {Coin, CoinService} from '../../core/grapfql/coin.service';
import {Prompt, PromptService} from '../../core/grapfql/prompt.service';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../core/auth/auth.service';
import {NgIf} from '@angular/common';
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
    MatIconModule

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


  public cols = 3;

  public coins: Coin[] = [];
  public prompts: Prompt[] = [];

  constructor(private coinService: CoinService, private promptService: PromptService, private authService: AuthService, private destroyRef: DestroyRef) {
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
    } else if (w < 1600) {
      this.cols = 2;
    } else {
      this.cols = 3;
    }
  }


  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

}
