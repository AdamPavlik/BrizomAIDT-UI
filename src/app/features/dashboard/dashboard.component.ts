import {Component} from '@angular/core';
import {AppSyncService, Coin} from '../../core/grapfql/app-sync.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  public coins: Array<Coin> = [];

  constructor(appSyncService: AppSyncService) {
  }

}
