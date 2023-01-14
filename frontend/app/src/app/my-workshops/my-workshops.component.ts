import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { WorkshopDetails } from '../models/workshop-details';
import { SharedService } from '../shared.service';
import { UserService } from '../user.service';
import { WorkshopService } from '../workshop.service';

@Component({
  selector: 'app-my-workshops',
  templateUrl: './my-workshops.component.html',
  styleUrls: ['./my-workshops.component.css']
})
export class MyWorkshopsComponent implements OnInit {

  constructor(private workshop_service: WorkshopService, private user_service: UserService, private sharedService: SharedService) { }

  allWorkshops: WorkshopDetails[] = [];
  myWorkshops: WorkshopDetails[] = [];
  current_user: User = null;
  index: number[] = [];
  reload: string = "true";

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    this.user_service.login(this.current_user.username, this.current_user.password).subscribe((user: User) => {
      this.current_user = user;
    });
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
        this.allWorkshops = workshops;

        for (let j = 0; j < this.allWorkshops.length; j++) {
          this.allWorkshops[j].date = new Date(this.allWorkshops[j].date);
          this.index[j] = j;

          if (this.allWorkshops[j].participants != null)
            if ((this.allWorkshops[j].participants.find((elem) => this.current_user.username == elem)) && this.allWorkshops[j].date > new Date())
              this.myWorkshops.push(this.allWorkshops[j]);
        }
      }
    });
  }

}
