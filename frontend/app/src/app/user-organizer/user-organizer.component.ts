import { Component, OnInit } from '@angular/core';
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
  constructor(private workshop_service: WorkshopService, private sharedService: SharedService) { }

  current_user: User = null;
  reload: string = "";
  allWorkshops: WorkshopDetails[] = [];

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
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
          if (workshops[j].owner == this.current_user.username) {
            workshops[j].date = new Date(workshops[j].date);
            this.allWorkshops.push(workshops[j]);
          }
        }
        for (let j = 0; j < workshops.length; j++) {
          workshops[j].date = new Date(workshops[j].date);
          if ((workshops[j].date.getTime() - (new Date()).getTime()) > 0)
            if (workshops[j].status == "approved" && (workshops[j].owner == this.current_user.username))
              this.allWorkshops.push(workshops[j]);
        }
      }
    });
  }
}
