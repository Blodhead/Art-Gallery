import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  showAuthBg = false;
  private sub: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.sub = this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        const url = evt.urlAfterRedirects || evt.url;
        this.showAuthBg = url.startsWith('/login') || url.startsWith('/register') || url.startsWith('/verify') || url.startsWith('/shippment');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

}

