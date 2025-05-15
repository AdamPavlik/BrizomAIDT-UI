import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {fromCognitoIdentityPool} from '@aws-sdk/credential-provider-cognito-identity';
import {CognitoIdentityClient} from '@aws-sdk/client-cognito-identity';
import {
  CognitoIdentityCredentialProvider
} from '@aws-sdk/credential-provider-cognito-identity/dist-types/fromCognitoIdentity';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: environment.googleIssuer,
  clientId: environment.googleClientId,
  redirectUri: window.location.origin,
  responseType: 'id_token token',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
  oidc: true,
  requestAccessToken: true,
  clearHashAfterLogin: true,
  disableAtHashCheck: true,
  silentRefreshShowIFrame: false,
  silentRefreshRedirectUri: window.location.origin + '/assets/html/silent-refresh.html',
  silentRefreshTimeout: 5000,
  timeoutFactor: 0.75,
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private credentialProvider: CognitoIdentityCredentialProvider | null = null;
  private cognitoClient: CognitoIdentityClient;

  constructor(private oauth: OAuthService) {
    this.cognitoClient = new CognitoIdentityClient({region: environment.awsRegion});
    this.initCredentialProvider();

    // Subscribe to token refresh events
    this.oauth.events.subscribe(event => {
      if (event.type === 'token_received' || event.type === 'token_refreshed') {
        this.initCredentialProvider();
      }
    });
  }

  private initCredentialProvider() {
    try {
      if (this.oauth.hasValidIdToken()) {
        this.credentialProvider = fromCognitoIdentityPool({
          client: this.cognitoClient,
          identityPoolId: environment.identityPoolId,
          logins: {'accounts.google.com': this.oauth.getIdToken()}
        });
      } else {
        this.credentialProvider = fromCognitoIdentityPool({
          client: this.cognitoClient,
          identityPoolId: environment.identityPoolId,
        });
      }
    } catch (error) {
      console.error('Error initializing credential provider:', error);
      // Ensure we always have a credential provider even if initialization fails
      if (!this.credentialProvider) {
        this.credentialProvider = fromCognitoIdentityPool({
          client: this.cognitoClient,
          identityPoolId: environment.identityPoolId,
        });
      }
    }
  }

  getCredentialProvider() {
    // If credentialProvider is null, initialize it
    if (this.credentialProvider === null) {
      this.initCredentialProvider();
    }

    // Ensure credentials are up-to-date before returning
    if (this.oauth.hasValidIdToken()) {
      const currentToken = this.oauth.getIdToken();
      // Check if token is about to expire (less than 5 minutes remaining)
      const tokenClaims = this.parseJwt<any>(currentToken);
      const expiresAt = tokenClaims.exp * 1000; // Convert to milliseconds
      const now = new Date().getTime();

      if (expiresAt - now < 300000) { // Less than 5 minutes
        // Token is about to expire, try to refresh it
        this.refreshToken();
      }
    }

    // If still null after initialization attempt, create a default one
    if (this.credentialProvider === null) {
      console.warn('Credential provider is still null after initialization, creating default');
      this.credentialProvider = fromCognitoIdentityPool({
        client: this.cognitoClient,
        identityPoolId: environment.identityPoolId,
      });
    }

    return this.credentialProvider;
  }

  isAuthenticated(): boolean {
    return this.oauth.hasValidIdToken();
  }

  getCurrentUser(): User {
    return this.parseJwt(this.oauth.getIdToken());
  }

  login() {
    this.oauth.initImplicitFlow();
  }

  logout() {
    this.oauth.logOut();
    window.location.reload();
  }

  refreshToken() {
    if (this.oauth.hasValidIdToken()) {
      this.oauth.silentRefresh()
        .then(() => {
          console.log('Silent refresh succeeded');
          this.initCredentialProvider();
        })
        .catch(error => {
          console.error('Silent refresh failed', error);
          // If silent refresh fails, redirect to login
          this.login();
        });
    } else {
      console.warn('No valid token to refresh');
    }
  }

  private parseJwt<T>(token: string): T {
    const [, payloadB64] = token.split('.');
    const json = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  }

}

export interface User {
  email: string;
  name: string;
  picture: string;
}
