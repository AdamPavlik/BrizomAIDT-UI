import {ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {OAuthService, provideOAuthClient} from 'angular-oauth2-oidc';
import {environment} from '../environments/environment';
import {authConfig} from './core/auth/auth.service';

export const appConfig: ApplicationConfig = {
    providers: [
      provideZoneChangeDetection({eventCoalescing: true}),
      provideRouter(routes),
      provideHttpClient(),
      provideOAuthClient({
        resourceServer: {
          allowedUrls: environment.allowedUrls,
          sendAccessToken: true
        }
      }),
      provideAppInitializer(async () => {
        const oAuthService = inject(OAuthService);
        oAuthService.silentRefreshShowIFrame = false;
        oAuthService.setStorage(localStorage);
        oAuthService.configure(authConfig);
        await oAuthService.loadDiscoveryDocumentAndTryLogin();
        if (oAuthService.hasValidIdToken()) {
          oAuthService.setupAutomaticSilentRefresh();
        }
      })
    ]
  }
;
