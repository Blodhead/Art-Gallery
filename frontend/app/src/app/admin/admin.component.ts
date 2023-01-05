import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { WorkshopDetails } from '../models/workshop-details'
import { WorkshopService } from '../workshop.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {


  constructor(private service: UserService, private workshop_service: WorkshopService, private _router: Router) { }

  active_tab: string = "Organizers";
  allUsers: User[] = [];
  organisers: User[] = [];
  participants: User[] = [];
  requests: User[] = [];
  workshops: WorkshopDetails[];
  index: number[] = [1];
  current_user: User;
  reload: string;

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    this.reload = localStorage.getItem("reload");
    if (this.reload == "true") {
      localStorage.removeItem("reload");
      location.reload();
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
        this.workshops = workshops;
        for (var i = 0; i < this.workshops.length; i++) {
          this.index[i] = i;

        }

        for (let j = 0; j < this.workshops.length; j++) {
          this.workshops[j].date = new Date(this.workshops[j].date);
        }
      }
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
