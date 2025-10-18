import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  clickEventSubscription: Subscription;

  constructor(private _router: Router, private sharedService: SharedService) {
    this.clickEventSubscription = this.sharedService.getEvent().subscribe(() => {
      location.reload()
    });
  }
  current_user: User = null;
  type: string = "";
  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    if (this.current_user != null) {
      this.type = this.current_user.type;
    }
  }

  private lastScrollTop = 0;
  isHidden = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > this.lastScrollTop && st > 50) {
      // down
      this.isHidden = true;
    } else {
      // up
      this.isHidden = false;
    }
    this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
  }

  logout() {
    localStorage.setItem("reload", "true");
    localStorage.removeItem("current_user");
    this._router.navigate(["login"]);
  }
}
