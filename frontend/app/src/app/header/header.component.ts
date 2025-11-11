import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
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

  constructor(private _router: Router, private sharedService: SharedService, private userService: UserService) {
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
    // initialize cart count from localStorage
    try {
      const raw = localStorage.getItem('shopping_cart');
      if (raw) {
        const cart = JSON.parse(raw);
        let count = 0;
        Object.keys(cart).forEach(k => {
          count += cart[k].qty || 0;
        })
        this.cartCount = count;
      }
    } catch (e) { console.error('cart init', e); }

    // subscribe to cart updates
    this.sharedService.getCartEvent().subscribe((cart) => {
      let count = 0;
      if (cart) Object.keys(cart).forEach(k => { count += cart[k].qty || 0; });
      this.cartCount = count;
    });
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

  hasToken = !!localStorage.getItem('token');
  cartCount = 0;

  filtersVisible = false;

  toggleVisible() {
    this.filtersVisible = !this.filtersVisible;
  }

  openCart(evt?: Event) {
    if (evt) evt.preventDefault();
    if (this.cartCount && this.cartCount > 0) {
      // navigate to shippment page
      window.location.href = '/shippment';
    } else {
      alert('Korpa je prazna!');
    }
  }

  reloadHome() {
    window.location.href = '/';
  }

  logout() {
    const username = JSON.parse(localStorage.getItem('current_user'));
    const token = JSON.parse(localStorage.getItem('token'));
    if (username && token) {
      this.userService.logout(username, token).subscribe(() => {
        // ignore result
      }, err => console.error(err));
    }
    localStorage.setItem("reload", "true");
    localStorage.removeItem("current_user");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = '/';
  }
 
}
