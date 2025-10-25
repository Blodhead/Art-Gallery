import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ParfumeDetails } from '../models/parfume-details';
import { OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-shippment',
  templateUrl: './shippment.component.html',
  styleUrls: ['./shippment.component.css']
})
export class ShippmentComponent implements OnInit, OnDestroy {
  firstName = '';
  lastName = '';
  address = '';
  city = '';
  postalCode = '';
  phone = '';
  street = '';
  number = '';
  houseNumber = '';

  private cartSub: Subscription;

  constructor(private router: Router, private shared: SharedService, private userService: UserService) {
    // try to prefill from localStorage
    const raw = localStorage.getItem('shipping_info');
    if (raw) {
      try {
        const obj = JSON.parse(raw);
        this.firstName = obj.firstName || '';
        this.lastName = obj.lastName || '';
        this.address = obj.address || '';
        this.city = obj.city || '';
        this.postalCode = obj.postalCode || '';
        this.phone = obj.phone || '';
        this.street = obj.street || '';
        this.number = obj.number || '';
        this.houseNumber = obj.houseNumber || '';
      } catch (e) { }
    }
  }

  cart: { [key: string]: { item: ParfumeDetails, qty: number } } = {};

  ngOnInit() {
    try {
      const raw = localStorage.getItem('shopping_cart');
      if (raw) this.cart = JSON.parse(raw);
    } catch (e) { this.cart = {}; }

    // subscribe to cart events so the list updates when user changes cart elsewhere
    this.cartSub = this.shared.getCartEvent().subscribe((cart) => {
      try { this.cart = cart || {}; } catch (e) { this.cart = {}; }
    });
  }

  entries() {
    return Object.keys(this.cart).map(k => ({ key: k, item: this.cart[k].item, qty: this.cart[k].qty }));
  }

  removeItem(key: string) {
    delete this.cart[key];
    localStorage.setItem('shopping_cart', JSON.stringify(this.cart));
    // notify others (header)
    this.shared.sendCartEvent(this.cart);
  }

  totalQty() {
    let n = 0;
    Object.keys(this.cart).forEach(k => { n += (this.cart[k] && this.cart[k].qty) || 0; });
    return n;
  }

  // When user presses Order: validate, persist shipping info, send order email via backend
  save() {
    if (!this.firstName || !this.lastName || !this.city || !this.postalCode || !this.phone || !this.street || !this.number || !this.houseNumber) {
      alert('Please fill all fields');
      return;
    }
    const info = {
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.street,
      city: this.city,
      postalCode: this.postalCode,
      phone: this.phone,
      street: this.street,
      number: this.number,
      houseNumber: this.houseNumber
    };
    localStorage.setItem('shipping_info', JSON.stringify(info));

    // determine recipient email from localStorage current_user or email key
    let recipient = null;
    try {
      const cur = JSON.parse(localStorage.getItem('email'));
      if (cur) recipient = cur || null;
    } catch (e) { }
    if (!recipient) {
      const alt = localStorage.getItem('email');
      if (alt) recipient = alt;
    }

    if (!recipient) { alert('Could not determine recipient email. Please log in.'); return; }

    // load cart
    let cart = {};
    try { cart = JSON.parse(localStorage.getItem('shopping_cart')) || {}; } catch (e) { cart = {}; }

    this.userService.order(recipient, cart, info).subscribe({
      next: (res: any) => {
        alert('Order placed — confirmation email sent');
        // clear cart
        localStorage.removeItem('shopping_cart');
        this.shared.sendCartEvent({});
        // navigate to home or orders page
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('order error', err);
        alert('Error placing order');
      }
    });
  }

  ngOnDestroy() {
    if (this.cartSub) this.cartSub.unsubscribe();
  }
}
