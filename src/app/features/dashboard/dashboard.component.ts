import {Component, HostListener} from '@angular/core';
import {Coin, CoinService} from '../../core/grapfql/coin.service';
import {Prompt, PromptService} from '../../core/grapfql/prompt.service';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../core/auth/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatGridList,
    MatGridTile,
    MatCardModule,
    MatButton,
    RouterLink,
    NgIf

  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  public cols = 3;

  public coins: Coin[] = [];
  public prompts: Prompt[] = [];

  constructor(private coinService: CoinService, private promptService: PromptService, private authService: AuthService) {
    if (authService.isAuthenticated()) {
      coinService.getCoins().then(coins => {this.coins = coins;});
      promptService.getPrompts().then(prompts => {this.prompts = prompts;});
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.updateCols();
  }

  private updateCols() {
    const w = window.innerWidth;
    if (w < 600) {
      this.cols = 1;
    } else if (w < 1200) {
      this.cols = 2;
    } else {
      this.cols = 3;
    }
  }


  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

}
