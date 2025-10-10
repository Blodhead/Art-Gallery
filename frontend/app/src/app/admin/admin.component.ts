import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { ParfumeDetails } from '../models/parfume-details'
import { ParfumeService } from '../parfume.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {


  constructor(private service: UserService, private parfume_service: ParfumeService, private _router: Router, private sharedService: SharedService) { }

  active_tab: string = "Organizers";
  allUsers: User[] = [];
  organisers: User[] = [];
  participants: User[] = [];
  requests: User[] = [];
  allParfumes: ParfumeDetails[] = [];
  index: number[] = [1];
  current_user: User = null;
  reload: string = "";

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));

    this.reload = localStorage.getItem("reload");
    if (this.reload == "true") {
      localStorage.removeItem("reload");
      this.sharedService.sendclickEvent();
      //location.reload();

    }
    if (this.current_user == null) this._router.navigate(["login"]);
    if (this.current_user.type != "admin") this._router.navigate([""]);
    this.service.getTempData().subscribe((data: User[]) => {

      if (localStorage.getItem("type") != null) {
        const str = localStorage.getItem("type");
        const str2 = str.charAt(0).toUpperCase() + str.slice(1) + "s";
        this.active_tab = str2;
        localStorage.removeItem("type");
      }

      for (var i = 0; i < data.length; i++) {

        if (data[i].type != "admin")
          this.allUsers.push(data[i]);
        else this.admin_user = data[i];

        if (data[i].status == "waiting")
          this.requests.push(data[i]);
        else if (data[i].type == "participant") this.participants.push(data[i]);
        else if (data[i].type == "organizer") this.organisers.push(data[i]);

      }
    })

    this.getAllParfumes();
  }

  admin_user: User = null;

  getAllParfumes() {
    this.parfume_service.getAllParfumes().subscribe((parfumes: ParfumeDetails[]) => {
      if (!parfumes) alert("Error");
      else {

        for (let j = 0; j < parfumes.length; j++) {
          /*parfumes[j].date = new Date(parfumes[j].date);
          if ((parfumes[j].date.getTime() - (new Date()).getTime()) > 0)
            if (parfumes[j].status == "waiting")
              this.allParfumes.push(parfumes[j]);*/
        }

        for (var i = 0; i < this.allParfumes.length; i++) {
          this.index[i] = i;
        }
      }
    });
  }

  approve(parfume: ParfumeDetails) {

    let temp_all: ParfumeDetails[] = [];

    this.parfume_service.getAllParfumes().subscribe((all: ParfumeDetails[]) => {
      temp_all = all;

      let temp_user: User = null;
      for (let i = 0; i < this.allUsers.length; i++) {
       /* if (parfume.owner == this.allUsers[i].username) {
          temp_user = this.allUsers[i];
          break;
        }*/
      }
      if (temp_user == null) { temp_user = this.admin_user; }

      /*for (let i = 0; i < temp_all.length; i++) {
        for (let j = 0; j < temp_all[i].participants.length; j++)
          if (((new Date(temp_all[i].date)).getTime() - (new Date()).getTime()) > 0)
            if (temp_all[i].participants[j].mail == temp_user.mail) {
              alert("This participant is still subscribed to one or more parfumes!");
              return;
            }
      }*/

      parfume.status = "approved";

      this.parfume_service.updateParfume(parfume).subscribe((statement) => { if (statement == null) { alert("Update status fail"); return; } else if (temp_user.type == "organizer" || temp_user.type == "admin") { location.reload(); return; } });

      if (temp_user.type != "participant") return;
      this.service.deleteUser(temp_user).subscribe((statement) => { if (statement == null) alert("Update status fail"); return; });

      this.service.register(temp_user.profile_photo_name, temp_user.firstname, temp_user.lastname, temp_user.username, temp_user.password, temp_user.mail, temp_user.phone, "organizer", null, null, null, null, null, null, null, "approved").subscribe((statement) => { if (statement == null) alert("Update status fail"); return; });

    });
  }

  reject(parfume) {
    this.parfume_service.delete(parfume).subscribe((statement) => {
      if (statement) alert("Deleted");
      else alert("Error reject");
      location.reload();
    });
  }

  getTab(): string {
    return this.active_tab;
  }

  setTab(input) {
    this.active_tab = input;
  }

  add_User() {
    localStorage.setItem("sent_user", (null));
    this._router.navigate(["admin/edit_user"]);
  };

  add_Parfume() {
    localStorage.setItem("sent_parfume", (null));
    this._router.navigate(["admin/edit_parfume"]);
  }

  delete(username, type) {
    let user = new User();
    localStorage.setItem("type", type);
    user.username = username.toString();
    this.service.deleteUser(user).subscribe((user) => {
      user = null;
      //location.reload();
    });
  }
}
