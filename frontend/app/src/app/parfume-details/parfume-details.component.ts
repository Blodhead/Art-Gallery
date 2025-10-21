import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import * as e from 'cors';
import { User } from '../models/user';
import { ParfumeDetails, Comment } from '../models/parfume-details';
import { ParfumeService } from '../parfume.service';
import { SharedService } from '../shared.service';


@Component({
  selector: 'app-parfume-details',
  templateUrl: './parfume-details.component.html',
  styleUrls: ['./parfume-details.component.css']
})
export class ParfumeDetailsComponent implements OnInit {

  @Input() myParfumeDetail: ParfumeDetails;
  @Input() myIndex: number;
  @Input() name: string;
  @Input() img_location: string;
  @Input() price: number;
  @Input() amount: number;
  flipDiv: boolean = false;
  likes: number = 0;
  comments: Comment[];

  constructor(private _router: Router, private parfume_Service: ParfumeService, private sharedService: SharedService) { }

  current_user: User;
  current_path: string;
  type: string = "";

  ngOnInit(): void {
    /*this.current_user = JSON.parse(localStorage.getItem("current_user"));
    this.current_path = this._router.url.split('/').pop();
    if (this.current_user != null) {
      this.type = this.current_user.type;
    }
    this.likes = this.myParfumeDetail.likes.length;

    if (this.current_user != null) {
      for (let iter = 0; iter < this.likes; iter++)
        if (this.myParfumeDetail.likes[iter] == this.current_user.username)
          this.like_toggle = true;

      this.comments = this.myParfumeDetail.comments;
    }*/
   // If img_location is already an absolute URL, keep it.
   // Otherwise, build a portable URL based on the current origin so images load correctly on any device.
   if (this.myParfumeDetail && this.myParfumeDetail.img_location) {
     const img = this.myParfumeDetail.img_location;
     if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('//')) {
       this.myParfumeDetail.img_location = img;
     } else if (img.startsWith('/')) {
       this.myParfumeDetail.img_location = window.location.origin + '/assets/images/' + img;
     } else {
       this.myParfumeDetail.img_location = window.location.origin + '/assets/images/' + img;
     }
   }
   this.myParfumeDetail.price = +this.myParfumeDetail.price;
   this.myParfumeDetail.amount = +this.myParfumeDetail.amount;

   // set current path so template can show page-specific UI (like remove on shippment)
   try {
     this.current_path = this._router.url.split('/').filter(Boolean).pop() || '';
   } catch (e) {
     this.current_path = '';
   }

  }

  // Image preview modal
  isPreviewOpen = false;
  previewSrc = '';

  openPreview() {
    this.previewSrc = this.myParfumeDetail.img_location;
    this.isPreviewOpen = true;
  }

  closePreview() {
    this.isPreviewOpen = false;
    this.previewSrc = '';
  }

  // CART helpers: read/write cart from localStorage. Cart format: { [parfumeName]: { item: ParfumeDetails, qty: number } }
  private readCart(): { [key: string]: { item: ParfumeDetails, qty: number } } {
    try {
      const raw = localStorage.getItem('shopping_cart');
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) {
      console.error('readCart error', e);
      return {};
    }
  }

  private writeCart(cart: { [key: string]: { item: ParfumeDetails, qty: number } }) {
    try {
      localStorage.setItem('shopping_cart', JSON.stringify(cart));
      // notify others (header) about cart change
      this.sharedService.sendCartEvent(cart);
    } catch (e) {
      console.error('writeCart error', e);
    }
  }

  getCartQty(): number {
    const cart = this.readCart();
    const entry = cart[this.myParfumeDetail.name];
    return entry ? entry.qty : 0;
  }

  incrementCart() {
    if (!localStorage.getItem('token')) { alert('You must be logged in to add items to cart'); return; }
    const cart = this.readCart();
    const key = this.myParfumeDetail.name;
    if (!cart[key]) cart[key] = { item: this.myParfumeDetail, qty: 0 };
    cart[key].qty = (cart[key].qty || 0) + 1;
    this.writeCart(cart);
  }

  decrementCart() {
    if (!localStorage.getItem('token')) { alert('You must be logged in to modify cart'); return; }
    const cart = this.readCart();
    const key = this.myParfumeDetail.name;
    if (!cart[key]) return; // nothing to decrement
    cart[key].qty = (cart[key].qty || 0) - 1;
    if (cart[key].qty <= 0) delete cart[key];
    this.writeCart(cart);
  }

  removeFromCart() {
    const cart = this.readCart();
    const key = this.myParfumeDetail.name;
    if (cart[key]) {
      delete cart[key];
      this.writeCart(cart);
    }
  }

  Toggle(): boolean {

    if (this.myIndex % 2 == 0)
      return true;
    else return false;

  }

  isOrganizer_page(): boolean {
    if (this.current_path == "user_organizer")
      return true;
    else return false;
  }

  open_chat() {
    localStorage.setItem("sent_parfume", JSON.stringify(this.myParfumeDetail));
    this._router.navigate(["chat"]);
  }

  add_Parfume() {
    localStorage.setItem("sent_parfume", JSON.stringify(this.myParfumeDetail));
    this._router.navigate(["admin/edit_parfume"]);
  }

  toMonthName(monthNumber): string {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', {
      month: 'short',
    });
  }

  sub() {
    this.parfume_Service.sub(this.current_user.email, this.myParfumeDetail.name, "waiting").subscribe((parfume) => {
      if (parfume) { alert("Success"); location.reload(); }
      else alert("fail");
    });
  }

  unsub() {

    let statement: boolean = false;
    let notify_mail_list: string[] = [];

    /*for (let i = 0; i < this.myParfumeDetail.participants.length; i++) {
      if (this.myParfumeDetail.participants[i].status == "notify")
        notify_mail_list.push(this.myParfumeDetail.participants[i].mail);
    }*/

    if (notify_mail_list.length != 0) { statement = true }

    this.parfume_Service.unsub(this.current_user.email, this.myParfumeDetail.name).subscribe((parfume) => {
      if (parfume) { alert("Success"); }
      else alert("fail");
      if (statement == false) this.rr();
    });


    this.parfume_Service.sendMail(notify_mail_list, this.myParfumeDetail.name).subscribe((mail: string) => {
      if (mail == "NIJE POSLATO") alert("Email NOT sent!");
      else alert("ERROR on mail!");

      this.rr();
    });
  }

  rr() {
    location.reload();
  }

  isSubscribed(): boolean {

    /*for (let i = 0; i < this.myParfumeDetail.participants.length; i++) {
      if (this.myParfumeDetail.participants[i].mail == this.current_user.mail)
        return true;
    }*/
    return false;

  }

  getPath(): string {
    return this.current_path;
  }

  like_toggle: boolean = false;

  like() {
    /*this.like_toggle = true;
    this.parfume_Service.like(this.myParfumeDetail.name, this.current_user.username).subscribe((statement) => {
      this.myParfumeDetail.likes.push(this.current_user.username);
      this.likes = this.myParfumeDetail.likes.length;
    });*/
  }

  unlike() {
    /*this.like_toggle = false;
    this.parfume_Service.unlike(this.myParfumeDetail.name, this.current_user.username).subscribe((statement) => {
      for (let iter = 0; iter < this.myParfumeDetail.likes.length; iter++)
        if (this.myParfumeDetail.likes[iter] == this.current_user.username) {
          this.myParfumeDetail.likes[iter] = null;
          this.myParfumeDetail.likes = this.myParfumeDetail.likes.filter(elements => {
            return (elements != null && elements !== undefined);
          });
        }

      this.likes = this.myParfumeDetail.likes.length;
    });*/
  }

  cancel() {
    if (this.flipDiv == false)
      this.flipDiv = true;
    else this.flipDiv = false;
    this.message = "";
  }

  message: string = "";

  comment() {
    /*if (this.message != "")
      this.parfume_Service.comment(this.myParfumeDetail.name, this.current_user.username, this.current_user.profile_photo_name, this.message, new Date()).subscribe((comment: Comment) => {
        this.myParfumeDetail.comments.push(comment);
        this.message = "";
      })*/
  }

  more(myParfumeDetail) {
    localStorage.setItem("detail_sent", JSON.stringify(myParfumeDetail));
    this._router.navigate(["details"]);
  }

  notify() {
    this.parfume_Service.sub(this.current_user.email, this.myParfumeDetail.name, "notify").subscribe((parfume) => {
      if (parfume) { alert("Success"); location.reload(); }
      else alert("fail");
    });
  }

}
