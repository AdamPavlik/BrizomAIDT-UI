import {Component} from '@angular/core';
import {CoinService} from '../../core/grapfql/coin.service';
import {PromptService} from '../../core/grapfql/prompt.service';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatGridList,
    MatGridTile,
    MatCardModule,
    MatButton,
    RouterLink

  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(private coinService: CoinService, private promptService: PromptService) {
  }

}
