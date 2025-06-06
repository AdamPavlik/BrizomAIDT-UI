import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {SignatureV4} from '@aws-sdk/signature-v4';
import {Sha256} from '@aws-crypto/sha256-js';
import {HttpRequest} from '@aws-sdk/protocol-http';
import {
  CognitoIdentityCredentialProvider
} from '@aws-sdk/credential-provider-cognito-identity/dist-types/fromCognitoIdentity';
import {environment} from '../../../environments/environment';
import {ApolloClient, ApolloLink, HttpLink, InMemoryCache} from '@apollo/client/core';


export const createSignedFetcher = (getCredentials: () => CognitoIdentityCredentialProvider, region: string, endpoint: string) => {
  return async (uri: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
    // Get fresh credentials for each request
    const credentials = getCredentials();

    const signer = new SignatureV4({
      credentials,
      region,
      service: 'appsync',
      sha256: Sha256,
    });

    const url = typeof uri === 'string' ? new URL(uri) : new URL(uri.toString());

    const requestToSign = new HttpRequest({
      method: options?.method || 'POST',
      headers: {
        ...(options?.headers as Record<string, string>),
        host: url.host,
      },
      hostname: url.hostname,
      path: url.pathname,
      body: options?.body as string,
    });

    const signedRequest = await signer.sign(requestToSign);

    return fetch(url.toString(), {
      method: signedRequest.method,
      headers: signedRequest.headers,
      body: signedRequest.body,
    });
  };
};


@Injectable({
  providedIn: 'root'
})
export class AppSyncService {


  constructor(private auth: AuthService) {
  }

  public getApollo() {
    const getCredentials = () => this.auth.getCredentialProvider();
    const signedFetch = createSignedFetcher(getCredentials, environment.awsRegion, environment.appSyncEndpoint);
    const httpLink = new HttpLink({
      uri: environment.appSyncEndpoint,
      fetch: signedFetch,
    });
    return new ApolloClient({
      link: ApolloLink.from([httpLink]),
      cache: new InMemoryCache(),
    });
  }

}
