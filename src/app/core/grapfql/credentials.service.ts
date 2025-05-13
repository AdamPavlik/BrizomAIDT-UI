import {Injectable} from '@angular/core';
import {AppSyncService} from './app-sync.service';
import {ApolloClient} from '@apollo/client/core';
import {ADD_CREDENTIALS, DELETE_CREDENTIALS, IS_CREDENTIALS_EXISTS} from './queries';
import {BehaviorSubject, distinctUntilChanged} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {


  private isCredentialsExistsSubject = new BehaviorSubject<boolean>(true);
  private isCredentialsExistsObservable = this.isCredentialsExistsSubject.asObservable()
    .pipe(distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)));

  public apollo: ApolloClient<any>;


  constructor(private appSync: AppSyncService) {
    this.apollo = appSync.getApollo();
    this.apollo.query<{ isCredentialsExists: boolean; }>({query: IS_CREDENTIALS_EXISTS}).then(({data}) => {
      this.isCredentialsExistsSubject.next(data.isCredentialsExists);
    })
  }

  isCredentialsExists() {
    return this.isCredentialsExistsObservable;
  }

  addCredentials(credentials: Credentials) {
    this.apollo.mutate<{ addCredentials: boolean; }>({
      mutation: ADD_CREDENTIALS,
      variables: {input: credentials}
    }).then(({data}) => {
      this.isCredentialsExistsSubject.next(data!.addCredentials)
    });
  }

  deleteCredentials() {
    this.apollo.mutate<{ deleteCredentials: boolean; }>({mutation: DELETE_CREDENTIALS}).then(({data}) => {
      this.isCredentialsExistsSubject.next(false);
    });
  }
}

export interface Credentials {
  userId?: string
  binanceKey: string;
  binanceSecretKey: string;
}
