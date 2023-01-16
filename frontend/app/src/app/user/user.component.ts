import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { WorkshopDetails } from '../models/workshop-details';
import { SharedService } from '../shared.service';
import { UserService } from '../user.service';
import { WorkshopService } from '../workshop.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {


  constructor(private workshop_service: WorkshopService, private user_service: UserService, private sharedService: SharedService) { }

  current_user: User;
  reload: string;
  allWorkshops: WorkshopDetails[] = [];
  activeWorkshops: WorkshopDetails[] = [];
  active_tab: string = "User";
  myWorkshops: WorkshopDetails[] = [];
  index: number[] = [];
  toggle1: boolean = true;
  toggle2: boolean = true;
  toggle3: boolean = true;

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
  }

  sortName() {
    if (this.toggle1 == false) {
      this.myWorkshops.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      this.toggle1 = true;
    } else if (this.toggle1 == true) {
      this.myWorkshops.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
      this.toggle1 = false;
    }
  }

  sortLocation() {
    if (this.toggle3 == false) {
      this.myWorkshops.sort((a, b) => {
        return a.location.localeCompare(b.location);
      });
      this.toggle3 = true;
    } else if (this.toggle3 == true) {
      this.myWorkshops.sort((a, b) => {
        return b.location.localeCompare(a.location);
      });
      this.toggle3 = false;
    }
  }

  sortDate() {
    if (this.toggle2 == false) {
      this.myWorkshops.sort((a, b) => {
        let g = new Date(b.date).getTime();
        let h = new Date(a.date).getTime();
        return g - h
      });
      this.toggle2 = true;
    } else if (this.toggle2 == true) {
      this.myWorkshops.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      });
      this.toggle2 = false;
    }
  }

  getAllWorkshops() {
    this.workshop_service.getAllWorkshops().subscribe((workshops: WorkshopDetails[]) => {
      if (!workshops) alert("Error");
      else {
        this.allWorkshops = workshops;

        for (let j = 0; j < this.allWorkshops.length; j++) {
          this.allWorkshops[j].date = new Date(this.allWorkshops[j].date);
          this.index[j] = j;

          if (this.allWorkshops[j].participants != null) {
            for (let k = 0; k < this.allWorkshops[j].participants.length; k++)
              if ((this.allWorkshops[j].participants[k].mail == this.current_user.mail) && this.allWorkshops[j].date < new Date()) {
                this.myWorkshops.push(this.allWorkshops[j]);
                break;
              }
          }
        }
      }
    });
  }

  getTab(): string {
    return this.active_tab;
  }

  setTab(input) {
    this.active_tab = input;
    if (input == "WorkshopHistory") this.getAllWorkshops();
  }

}
