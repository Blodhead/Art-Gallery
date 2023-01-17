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
}
