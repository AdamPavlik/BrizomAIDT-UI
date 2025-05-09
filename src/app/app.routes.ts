import {Routes} from '@angular/router';
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {PromptComponent} from './features/prompt/prompt.component';
import {CoinComponent} from './features/coin/coin.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'prompt', component: PromptComponent },
  { path: 'coin', component: CoinComponent },
];
