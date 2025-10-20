import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }


  private subject = new Subject<any>();
  obj: any;
  sendclickEvent() {
    this.subject.next(this.obj);
  }

  getEvent(): Observable<any> {
    return this.subject.asObservable();

  }

  // New subject for cart updates
  private cartSubject = new Subject<any>();

  sendCartEvent(cart: any) {
    this.cartSubject.next(cart);
  }

  getCartEvent(): Observable<any> {
    return this.cartSubject.asObservable();
  }
}
