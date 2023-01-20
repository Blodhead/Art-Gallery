import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { WorkshopDetails } from '../models/workshop-details'
import { WorkshopService } from '../workshop.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {


  constructor(private service: UserService, private workshop_service: WorkshopService, private _router: Router, private sharedService: SharedService) { }

  active_tab: string = "Organizers";
  allUsers: User[] = [];
  organisers: User[] = [];
  participants: User[] = [];
  requests: User[] = [];
  allWorkshops: WorkshopDetails[] = [];
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

        if (data[i].status == "waiting")
          this.requests.push(data[i]);
        else if (data[i].type == "participant") this.participants.push(data[i]);
        else if (data[i].type == "organizer") this.organisers.push(data[i]);

      }
    })

    this.getAllWorkshops();
  }

  getAllWorkshops() {
    this.workshop_service.getAllWorkshops().subscribe((workshops: WorkshopDetails[]) => {
      if (!workshops) alert("Error");
      else {

        for (let j = 0; j < workshops.length; j++) {
          workshops[j].date = new Date(workshops[j].date);
          if ((workshops[j].date.getTime() - (new Date()).getTime()) > 0)
            if (workshops[j].status == "waiting")
              this.allWorkshops.push(workshops[j]);
        }

        for (var i = 0; i < this.allWorkshops.length; i++) {
          this.index[i] = i;
        }
      }
    });
  }

  approve(workshop: WorkshopDetails) {

    let temp_all: WorkshopDetails[] = [];

    this.workshop_service.getAllWorkshops().subscribe((all: WorkshopDetails[]) => {
      temp_all = all;

      let temp_user: User = null;
      for (let i = 0; i < this.allUsers.length; i++) {
        if (workshop.owner == this.allUsers[i].username) {
          temp_user = this.allUsers[i];
          break;
        }
      }

      for (let i = 0; i < temp_all.length; i++) {
        for (let j = 0; j < temp_all[i].participants.length; j++)
          if (((new Date(temp_all[i].date)).getTime() - (new Date()).getTime()) > 0)
            if (temp_all[i].participants[j].mail == temp_user.mail) {
              alert("This participant is still subscribed to one or more workshops!");
              return;
            }
      }

      workshop.status = "approved";

      this.workshop_service.updateWorkshop(workshop).subscribe((statement) => { if (statement == null) alert("Update status fail"); return; });

      if (temp_user.type == "organizer") { location.reload(); return; }

      this.service.deleteUser(temp_user).subscribe((statement) => { if (statement == null) alert("Update status fail"); return; });

      this.service.register(temp_user.profile_photo_name, temp_user.firstname, temp_user.lastname, temp_user.username, temp_user.password, temp_user.mail, temp_user.phone, "organizer", null, null, null, null, null, null, null, "approved").subscribe((statement) => { if (statement == null) alert("Update status fail"); return; });

    });
  }

  reject(workshop) {
    this.workshop_service.delete(workshop).subscribe((statement) => {
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

  add_Workshop() {
    localStorage.setItem("sent_workshop", (null));
    this._router.navigate(["admin/edit_workshop"]);
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
