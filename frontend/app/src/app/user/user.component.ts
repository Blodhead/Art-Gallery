import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { WorkshopDetails } from '../models/workshop-details';
import { UserService } from '../user.service';
import { WorkshopService } from '../workshop.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {


  constructor(private workshop_service: WorkshopService, private user_service: UserService) { }

  current_user: User;
  reload: string;
  allWorkshops: WorkshopDetails[] = [];
  active_tab: string = "User";
  myWorkshops: WorkshopDetails[] = [];
  index: number[] = [];

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    this.user_service.login(this.current_user.username, this.current_user.password).subscribe((user: User) => {
      this.current_user = user;
    });
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

        for (let j = 0; j < this.allWorkshops.length; j++) {
          this.allWorkshops[j].date = new Date(this.allWorkshops[j].date);
          this.index[j] = j;
        }
        //show only if he's on the list of participants
        this.myWorkshops = this.allWorkshops;
      }
    });
  }

  getTab(): string {
    return this.active_tab;
  }

  setTab(input) {
    this.active_tab = input;
  }

}
