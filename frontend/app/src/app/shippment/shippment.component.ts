import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ParfumeDetails } from '../models/parfume-details';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-shippment',
  templateUrl: './shippment.component.html',
  styleUrls: ['./shippment.component.css']
})
export class ShippmentComponent implements OnInit, OnDestroy {
  firstName = '';
  lastName = '';
  phone = '';
  street = '';
  number = '';
  houseNumber = '';
  city = '';
  postalCode = '';

  constructor(private router: Router, private sharedService: SharedService) {
    // try to prefill from localStorage
    const raw = localStorage.getItem('shipping_info');
    if (raw) {
      try {
        const obj = JSON.parse(raw);
        this.firstName = obj.firstName || '';
        this.lastName = obj.lastName || '';
        this.phone = obj.phone || '';
        this.street = obj.street || '';
        this.number = obj.number || '';
        this.houseNumber = obj.houseNumber || '';
        this.city = obj.city || '';
        this.postalCode = obj.postalCode || '';
      } catch (e) { }
    }
  }

  cart: { [key: string]: { item: ParfumeDetails, qty: number } } = {};
  cartSub: Subscription;

  ngOnInit() {
    try {
      const raw = localStorage.getItem('shopping_cart');
      if (raw) this.cart = JSON.parse(raw);
    } catch (e) { this.cart = {}; }
    // emit cart state so header badge initializes correctly
    this.sharedService.sendCartEvent(this.cart);

    this.cartSub = this.sharedService.getCartEvent().subscribe((cart) => {
      try {
        this.cart = cart || {};
      } catch (e) { this.cart = {}; }
    });
  }

  entries() {
    return Object.keys(this.cart).map(k => ({ key: k, item: this.cart[k].item, qty: this.cart[k].qty }));
  }

  removeItem(key: string) {
    delete this.cart[key];
    localStorage.setItem('shopping_cart', JSON.stringify(this.cart));
    // emit cart update so header updates
    this.sharedService.sendCartEvent(this.cart);
    // refresh local view
    this.ngOnInit();
  }

  ngOnDestroy() {
    if (this.cartSub) this.cartSub.unsubscribe();
  }

  totalQty() {
    let n = 0;
    Object.keys(this.cart).forEach(k => { n += (this.cart[k] && this.cart[k].qty) || 0; });
    return n;
  }

  save() {
    if (!this.firstName || !this.lastName || !this.phone || !this.street || !this.number || !this.houseNumber || !this.city || !this.postalCode) {
      alert('Please fill all fields');
      return;
    }
    const info = {
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      street: this.street,
      number: this.number,
      houseNumber: this.houseNumber,
      city: this.city,
      postalCode: this.postalCode
    };
    localStorage.setItem('shipping_info', JSON.stringify(info));
    alert('Shipping information saved');
    this.router.navigate(['/cart']);
  }
}
