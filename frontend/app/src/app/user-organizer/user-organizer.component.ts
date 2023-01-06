import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { WorkshopDetails } from '../models/workshop-details';
import { WorkshopService } from '../workshop.service';

@Component({
  selector: 'app-user-organizer',
  templateUrl: './user-organizer.component.html',
  styleUrls: ['./user-organizer.component.css']
})
export class UserOrganizerComponent implements OnInit{
  constructor(private workshop_service:WorkshopService){}

  current_user :User;
  reload :string;
  allWorkshops: WorkshopDetails[];

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    this.reload = localStorage.getItem("reload");
    if (this.reload == "true") {
      localStorage.removeItem("reload");
      location.reload();
    }
    this.getAllWorkshops();
  }

  getAllWorkshops() {
    this.workshop_service.getAllWorkshops().subscribe((workshops: WorkshopDetails[]) => {
      if (!workshops) alert("Error");
      else {
        this.allWorkshops = workshops;

        for(let j = 0; j < this.allWorkshops.length; j++){
          this.allWorkshops[j].date = new Date(this.allWorkshops[j].date);
        }
      }
    });
  }
}
