import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import * as e from 'cors';
import { User } from '../models/user';
import { ParfumeDetails, Comment } from '../models/parfume-details';
import { UserService } from '../user.service';
import { ParfumeService } from '../parfume.service';


@Component({
  selector: 'app-parfume-details',
  templateUrl: './parfume-details.component.html',
  styleUrls: ['./parfume-details.component.css']
})
export class ParfumeDetailsComponent implements OnInit {

  @Input() myParfumeDetail: ParfumeDetails;
  @Input() myIndex: number;
  flipDiv: boolean = false;
  likes: number = 0;
  comments: Comment[];

  constructor(private _router: Router, private parfume_Service: ParfumeService) { }

  current_user: User;
  current_path: string;
  type: string = "";

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
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
    }

  }

  hasFree() {
    let temp_counter = 0;
    for (let i = 0; i < this.myParfumeDetail.participants.length; i++) {

      if (this.myParfumeDetail.participants[i].mail == this.current_user.mail) return true;

      if (this.myParfumeDetail.participants[i].status == "notify" || this.myParfumeDetail.participants[i].status == "waiting")
        temp_counter++;
    }
    if (this.myParfumeDetail.free_spaces > temp_counter)
      return true;
    else return false;
  }

  Toggle(): boolean {

    if (this.myIndex % 2 == 0)
      return true;
    else return false;

  }

  edit_enable(myParfumeDetail: ParfumeDetails) {
    if ((new Date(myParfumeDetail.date).getTime() - (new Date()).getTime() > 0))
      return false;
    else return true;
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
    this.parfume_Service.sub(this.current_user.mail, this.myParfumeDetail.name, "waiting").subscribe((parfume) => {
      if (parfume) { alert("Success"); location.reload(); }
      else alert("fail");
    });
  }

  unsub() {

    let statement: boolean = false;
    let notify_mail_list: string[] = [];

    for (let i = 0; i < this.myParfumeDetail.participants.length; i++) {
      if (this.myParfumeDetail.participants[i].status == "notify")
        notify_mail_list.push(this.myParfumeDetail.participants[i].mail);
    }

    if (notify_mail_list.length != 0) { statement = true }

    this.parfume_Service.unsub(this.current_user.mail, this.myParfumeDetail.name).subscribe((parfume) => {
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

    for (let i = 0; i < this.myParfumeDetail.participants.length; i++) {
      if (this.myParfumeDetail.participants[i].mail == this.current_user.mail)
        return true;
    }
    return false;

  }

  isTime(): boolean {
    if (this.isSubscribed() == false) return false;
    else if ((new Date(this.myParfumeDetail.date).getTime() - (new Date()).getTime() > 1800000) && this.current_path == 'MyParfumes')
      return true;
    else return false;
  }

  getPath(): string {
    return this.current_path;
  }

  like_toggle: boolean = false;

  like() {
    this.like_toggle = true;
    this.parfume_Service.like(this.myParfumeDetail.name, this.current_user.username).subscribe((statement) => {
      this.myParfumeDetail.likes.push(this.current_user.username);
      this.likes = this.myParfumeDetail.likes.length;
    });
  }

  unlike() {
    this.like_toggle = false;
    this.parfume_Service.unlike(this.myParfumeDetail.name, this.current_user.username).subscribe((statement) => {
      for (let iter = 0; iter < this.myParfumeDetail.likes.length; iter++)
        if (this.myParfumeDetail.likes[iter] == this.current_user.username) {
          this.myParfumeDetail.likes[iter] = null;
          this.myParfumeDetail.likes = this.myParfumeDetail.likes.filter(elements => {
            return (elements != null && elements !== undefined);
          });
        }

      this.likes = this.myParfumeDetail.likes.length;
    });
  }

  cancel() {
    if (this.flipDiv == false)
      this.flipDiv = true;
    else this.flipDiv = false;
    this.message = "";
  }

  message: string = "";

  comment() {
    if (this.message != "")
      this.parfume_Service.comment(this.myParfumeDetail.name, this.current_user.username, this.current_user.profile_photo_name, this.message, new Date()).subscribe((comment: Comment) => {
        this.myParfumeDetail.comments.push(comment);
        this.message = "";
      })
  }

  more(myParfumeDetail) {
    localStorage.setItem("detail_sent", JSON.stringify(myParfumeDetail));
    this._router.navigate(["details"]);
  }

  notify() {
    this.parfume_Service.sub(this.current_user.mail, this.myParfumeDetail.name, "notify").subscribe((parfume) => {
      if (parfume) { alert("Success"); location.reload(); }
      else alert("fail");
    });
  }

}
