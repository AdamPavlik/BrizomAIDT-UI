import {Component} from '@angular/core';
import {AppSyncService} from '../../core/grapfql/app-sync.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(appSyncService: AppSyncService) {
  }

}
