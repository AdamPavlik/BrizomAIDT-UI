import {Component, inject, OnDestroy, signal} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatDivider, MatList, MatListItem, MatNavList} from '@angular/material/list';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon, MatIconRegistry} from '@angular/material/icon';
import {MediaMatcher} from '@angular/cdk/layout';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {AuthService} from './core/auth/auth.service';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavContent, MatNavList, MatSidenav, MatSidenavContainer, MatToolbar, MatIcon, MatIconButton, NgIf, RouterLink, MatButton, MatMenu, MatMenuTrigger, MatList, MatListItem, MatDivider],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  title = 'AIDT';


  protected readonly isMobile = signal(true);
  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor(iconReg: MatIconRegistry, sanitizer: DomSanitizer, private auth: AuthService) {
    const media = inject(MediaMatcher);
    iconReg.addSvgIcon(
      'side-nav',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/side-nav-icon.svg'),
    );

    iconReg.addSvgIcon(
      'logo',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/logo.svg'),
    );

    iconReg.addSvgIcon(
      'google',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/web_dark_rd_SI.svg'),
    );

    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  closeNavIfMobile(nav: MatSidenav) {
    if(this.isMobile()) {
      nav.close();
    }
  }

  login() {
    this.auth.login();
  }

  logOut() {
    this.auth.logout();
  }

  isAuthenticated(): boolean {
   return this.auth.isAuthenticated();
  }

  currentUser() {
    return  this.auth.getCurrentUser()
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

}
