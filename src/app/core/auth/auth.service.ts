import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {fromCognitoIdentityPool} from '@aws-sdk/credential-provider-cognito-identity';
import {CognitoIdentityClient} from '@aws-sdk/client-cognito-identity';
import {
  CognitoIdentityCredentialProvider
} from '@aws-sdk/credential-provider-cognito-identity/dist-types/fromCognitoIdentity';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {filter} from 'rxjs';
import {Router} from '@angular/router';

export const authConfig: AuthConfig = {
  issuer: environment.googleIssuer,
  clientId: environment.googleClientId,
  redirectUri: window.location.origin,
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
  silentRefreshShowIFrame: false,
  useSilentRefresh: true,
  silentRefreshRedirectUri: window.location.origin + "/assets/html/silent-refresh.html",
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private credentialProvider: CognitoIdentityCredentialProvider | null = null;
  private cognitoClient: CognitoIdentityClient;

  constructor(private oauth: OAuthService, private router: Router) {
    this.cognitoClient = new CognitoIdentityClient({region: environment.awsRegion});
    this.initCredentialProvider();
    this.oauth.events
      .pipe(filter(e => e.type === 'token_received'))
      .subscribe(() => {
        this.initCredentialProvider()
      });
  }

  private initCredentialProvider() {
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
  }

  getCredentialProvider() {
    if (this.credentialProvider === null) {
      this.initCredentialProvider();
    }
    return this.credentialProvider!;
  }

  isAuthenticated(): boolean {
    return this.oauth.hasValidIdToken();
  }

  getCurrentUser(): User {
    let claims = this.oauth.getIdentityClaims();
    return {
      email: claims['email'],
      picture: claims['picture'],
      name: claims['name'],
    }
  }

  login() {
    this.oauth.initLoginFlow()
  }

  logout() {
    this.router.navigate(['']).then(value => {
      this.oauth.logOut();
      window.location.reload();
    });
  }
}

export interface User {
  email: string;
  name: string;
  picture: string;
}
