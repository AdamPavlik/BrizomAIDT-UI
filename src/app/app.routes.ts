import {Routes} from '@angular/router';
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {PromptComponent} from './features/prompt/prompt.component';
import {CoinComponent} from './features/coin/coin.component';
import {authenticatedGuard} from './core/auth/authenticated.guard';
import {SettingsComponent} from './features/settings/settings.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'prompt', component: PromptComponent, canActivate: [authenticatedGuard] },
  { path: 'coin', component: CoinComponent, canActivate: [authenticatedGuard]},
  { path: 'settings', component: SettingsComponent, canActivate: [authenticatedGuard]},
  { path: '**', redirectTo: '', }
];
