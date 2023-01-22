import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { WorkshopDetails } from '../models/workshop-details';
import { SharedService } from '../shared.service';
import { WorkshopService } from '../workshop.service';

@Component({
  selector: 'app-user-organizer',
  templateUrl: './user-organizer.component.html',
  styleUrls: ['./user-organizer.component.css']
})
export class UserOrganizerComponent implements OnInit {
  constructor(private workshop_service: WorkshopService, private sharedService: SharedService, private _router: Router) { }

  current_user: User = null;
  reload: string = "";
  allWorkshops: WorkshopDetails[] = [];

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    if (this.current_user == null) this._router.navigate(["login"]);
    if (this.current_user.type != "organizer") this._router.navigate([""]);
    this.reload = localStorage.getItem("reload");
    if (this.reload == "true") {
      localStorage.removeItem("reload");
      this.sharedService.sendclickEvent();
    }
    this.getAllWorkshops();
  }

  getAllWorkshops() {
    this.workshop_service.getAllWorkshops().subscribe((workshops: WorkshopDetails[]) => {
      if (!workshops) alert("Error");
      else {

        for (let j = 0; j < workshops.length; j++) {
          workshops[j].date = new Date(workshops[j].date);
            if (workshops[j].status == "approved" && (workshops[j].owner == this.current_user.username))
              this.allWorkshops.push(workshops[j]);
        }
      }
    });
  }

  add_new(){

    localStorage.removeItem("sent_workshop");
    this._router.navigate(["admin/edit_workshop"]);
  }

}
