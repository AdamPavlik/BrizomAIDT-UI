import {Routes} from '@angular/router';
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {PromptComponent} from './features/prompt/prompt.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'prompt', component: PromptComponent },
];
