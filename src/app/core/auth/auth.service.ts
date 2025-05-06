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
  silentRefreshRedirectUri: window.location.origin,
  responseType: 'id_token token',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
  oidc: true,
  requestAccessToken: true,
  clearHashAfterLogin: true,
  disableAtHashCheck: true,
  showDebugInformation: true,
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private credsProvider!: CognitoIdentityCredentialProvider;

  constructor(private oauth: OAuthService) {
    this.oauth.configure(authConfig);
    this.oauth.loadDiscoveryDocumentAndTryLogin().then(() => {
      this.oauth.setupAutomaticSilentRefresh();
      if(this.oauth.hasValidIdToken()) {
        this.credsProvider = fromCognitoIdentityPool({
          client: new CognitoIdentityClient({region: environment.awsRegion}),
          identityPoolId: environment.identityPoolId,
          logins: {'accounts.google.com': this.oauth.getIdToken()}
        });
      } else {
        this.credsProvider = fromCognitoIdentityPool({
          client: new CognitoIdentityClient({region: environment.awsRegion}),
          identityPoolId: environment.identityPoolId,
        });
      }
    })
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
    this.credsProvider = fromCognitoIdentityPool({
      client: new CognitoIdentityClient({region: environment.awsRegion}),
      identityPoolId: environment.identityPoolId
    })
  }

  awsCredentialsProvider(): CognitoIdentityCredentialProvider {
    return this.credsProvider;
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
