import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Message, ParfumeDetails } from '../models/parfume-details';
import { SharedService } from '../shared.service';
import { UserService } from '../user.service';
import { ParfumeService } from '../parfume.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {


  constructor(private parfume_service: ParfumeService, private user_service: UserService, private sharedService: SharedService, private _router: Router) { }

  current_user: User;
  reload: string;
  allParfumes: ParfumeDetails[] = [];
  fullWorskhops: ParfumeDetails[] = [];
  activeParfumes: ParfumeDetails[] = [];
  active_tab: string = "User";
  myParfumes: ParfumeDetails[] = [];
  chats: ParfumeDetails[] = [];
  index: number[] = [];
  toggle1: boolean = true;
  toggle2: boolean = true;
  toggle3: boolean = true;
  loaded: boolean = false;

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    if (this.current_user == null) this._router.navigate(["login"]);
    if (this.current_user.type != "participant") this._router.navigate([""]);
    this.user_service.login(this.current_user.username, this.current_user.password).subscribe((user: User) => {
      this.current_user = user;
    });
    this.reload = localStorage.getItem("reload");
    if (this.reload == "true") {
      localStorage.removeItem("reload");
      this.sharedService.sendclickEvent();
    }
    localStorage.removeItem("sent_parfume");
    this.getAllParfumes();
  }

  sortName() {
    if (this.toggle1 == false) {
      this.myParfumes.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      this.toggle1 = true;
    } else if (this.toggle1 == true) {
      this.myParfumes.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
      this.toggle1 = false;
    }
  }


  getAllParfumes() {
    if (this.loaded == true) return;
    else this.loaded = true;
    this.parfume_service.getAllParfumes().subscribe((parfumes: ParfumeDetails[]) => {
      if (!parfumes) alert("Error");
      else {
        this.allParfumes = parfumes;
        this.fullWorskhops = parfumes;
      }

    });
  }

  getTab(): string {
    return this.active_tab;
  }

  flip: boolean = false;

  setTab(input) {
    this.active_tab = input;
    if (input == "ParfumeHistory") this.getAllParfumes();
    if (input == "Actions") this.getAllParfumes();
  }

  unlike(parfume) {
    this.parfume_service.unlike(parfume.name, this.current_user.username).subscribe((statement) => {

      for (let j = 0; j < this.myParfumes.length; j++) {

        if (this.myParfumes[j] == parfume) {
          for (let iter = 0; iter < parfume.likes.length; iter++)
            if (parfume.likes[iter] == this.current_user.username) {
              parfume.likes[iter] = null;
              parfume.likes = parfume.likes.filter(elements => {
                return (elements != null && elements !== undefined);
              });
            }
          break;
        }
      }
    });
  }

  uncomment(parfume, comment) {
    this.parfume_service.uncomment(parfume.name, comment).subscribe((statement) => {
      for (let j = 0; j < this.myParfumes.length; j++) {

        if (this.myParfumes[j] == parfume) {
          for (let iter = 0; iter < parfume.comments.length; iter++)
            if (parfume.comments[iter] == comment) {
              parfume.comments[iter] = null;
              parfume.comments = parfume.comments.filter(elements => {
                return (elements != null && elements !== undefined);
              });
            }
          break;
        }
      }
    });
  }


}
