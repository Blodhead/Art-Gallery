import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as e from 'cors';
import { User } from '../models/user';
import { WorkshopDetails } from '../models/workshop-details';
import { WorkshopService } from '../workshop.service';


@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.css']
})
export class WorkshopDetailsComponent implements OnInit {

  @Input() myWorkshopDetail: WorkshopDetails;
  @Input() myIndex: number;
  flipDiv: boolean = false;


  constructor(private _router: Router, private workshop_Service: WorkshopService) { }

  current_user: User;
  current_path: string;
  type: string = "";

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    this.current_path = this._router.url.split('/').pop();
    if (this.current_user != null) {
      this.type = this.current_user.type;
    }
  }

  Toggle(): boolean {

    if (this.myIndex % 2 == 0)
      return true;
    else return false;

  }

  add_Workshop() {
    localStorage.setItem("sent_workshop", JSON.stringify(this.myWorkshopDetail));
    this._router.navigate(["admin/edit_workshop"]);
  }

  toMonthName(monthNumber): string {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', {
      month: 'short',
    });
  }

  sub() {
    this.workshop_Service.sub(this.current_user.mail, this.myWorkshopDetail.name).subscribe((workshop) => {
      if (workshop) { alert("Success"); location.reload(); }
      else alert("fail");
    });
  }

  unsub() {
    this.workshop_Service.unsub(this.current_user.mail, this.myWorkshopDetail.name).subscribe((workshop) => {
      if (workshop) { alert("Success"); location.reload(); }
      else alert("fail");
    });
  }

  isSubscribed(): boolean {

    for (let i = 0; i < this.myWorkshopDetail.participants.length; i++) {
      if (this.myWorkshopDetail.participants[i].mail == this.current_user.mail)
        return true;
    }
    return false;

  }

  isTime(): boolean {
    if (this.isSubscribed() == false) return false;
    else if ((this.myWorkshopDetail.date.getTime() - (new Date()).getTime() > 1800000) && this.current_path == 'MyWorkshops')
      return true;
    else return false;
  }

  getPah(): string {
    return this.current_path;
  }

  like_toggle: boolean = false;

  like() {
    this.like_toggle = true;
  }

  unlike() {
    this.like_toggle = false;
  }

  comment() {
    if(this.flipDiv==false)
    this.flipDiv = true;
    else this.flipDiv = false;
  }
}
