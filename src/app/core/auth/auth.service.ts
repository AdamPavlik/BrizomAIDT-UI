import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {CognitoIdentityCredentials, fromCognitoIdentityPool} from '@aws-sdk/credential-provider-cognito-identity';
import {CognitoIdentityClient} from '@aws-sdk/client-cognito-identity';
import {
    CognitoIdentityCredentialProvider
} from '@aws-sdk/credential-provider-cognito-identity/dist-types/fromCognitoIdentity';

declare global {
    interface Window {
        google: any;
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private credsProvider!: CognitoIdentityCredentialProvider;

    constructor() {
        window.google?.accounts?.id.initialize({
            client_id: environment.googleClientId,
            callback: this.handleCredResponse.bind(this)
        });
    }


    private async handleCredResponse(response: { credential: string }) {
        const idToken = response.credential;
        console.log(response);


        const profile = this.parseJwt<{
            sub: string;
            email: string;
            name: string;
            picture: string;
        }>(idToken);

        console.log(profile);


        this.credsProvider = fromCognitoIdentityPool({
            client: new CognitoIdentityClient({region: environment.awsRegion}),
            identityPoolId: environment.identityPoolId,
            logins: {'accounts.google.com': idToken}
        });


        const creds = await this.credsProvider();
        console.log('AWS creds:', creds);
    }

    private parseJwt<T>(token: string): T {
        const [, payloadB64] = token.split('.');
        const json = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(json);
    }

    renderButton(elementId: string) {
        window.google.accounts.id.renderButton(
            document.getElementById(elementId),
            {
                theme: 'filled_black',  // black background with white text
                size: 'small',         // smaller overall footprint
                type: 'standard'       // keeps the “Sign in with Google” text
            }
        );
    }

    async getCredentials(): Promise<CognitoIdentityCredentials> {
        if (!this.credsProvider) {
            throw new Error('Not signed in yet');
        }
        return await this.credsProvider();
    }

}
