import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const oauth = inject(AuthService);
  return oauth.isAuthenticated();
};
