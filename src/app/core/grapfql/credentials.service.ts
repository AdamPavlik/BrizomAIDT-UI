import {Injectable} from '@angular/core';
import {AppSyncService} from './app-sync.service';
import {ADD_CREDENTIALS, DELETE_CREDENTIALS, IS_CREDENTIALS_EXISTS} from './queries';
import {BehaviorSubject, distinctUntilChanged} from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {


  private isCredentialsExistsSubject = new BehaviorSubject<boolean>(true);
  private isCredentialsExistsObservable = this.isCredentialsExistsSubject.asObservable()
    .pipe(distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)));



  constructor(private appSync: AppSyncService, private authService: AuthService) {
    if (authService.isAuthenticated()) {
      this.appSync.getApollo().query<{ isCredentialsExists: boolean; }>({query: IS_CREDENTIALS_EXISTS}).then(({data}) => {
        this.isCredentialsExistsSubject.next(data.isCredentialsExists);
      })
    }

  }

  isCredentialsExists() {
    return this.isCredentialsExistsObservable;
  }

  addCredentials(credentials: Credentials) {
    this.appSync.getApollo().mutate<{ addCredentials: boolean; }>({
      mutation: ADD_CREDENTIALS,
      variables: {input: credentials}
    }).then(({data}) => {
      this.isCredentialsExistsSubject.next(data!.addCredentials)
    });
  }

  deleteCredentials() {
    this.appSync.getApollo().mutate<{ deleteCredentials: boolean; }>({mutation: DELETE_CREDENTIALS}).then(({data}) => {
      this.isCredentialsExistsSubject.next(false);
    });
  }
}

export interface Credentials {
  userId?: string
  binanceKey: string;
  binanceSecretKey: string;
}
