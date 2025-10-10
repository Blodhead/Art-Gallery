import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { ParfumeDetails } from '../models/parfume-details';
import { SharedService } from '../shared.service';
import { UserService } from '../user.service';
import { ParfumeService } from '../parfume.service';

@Component({
  selector: 'app-my-parfumes',
  templateUrl: './my-parfumes.component.html',
  styleUrls: ['./my-parfumes.component.css']
})
export class MyParfumesComponent implements OnInit {

  constructor(private parfume_service: ParfumeService, private user_service: UserService, private sharedService: SharedService, private _router:Router) { }

  allParfumes: ParfumeDetails[] = [];
  myParfumes: ParfumeDetails[] = [];
  current_user: User = null;
  index: number[] = [];
  reload: string = "true";

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    if (this.current_user == null) this._router.navigate(["login"]);
    this.user_service.login(this.current_user.username, this.current_user.password).subscribe((user: User) => {
      this.current_user = user;
    });
    this.reload = localStorage.getItem("reload");
    if (this.reload == "true") {
      localStorage.removeItem("reload");
      this.sharedService.sendclickEvent();
    }
    this.getAllParfumes();

  }

  getAllParfumes() {
    this.parfume_service.getAllParfumes().subscribe((parfumes: ParfumeDetails[]) => {
      if (!parfumes) alert("Error");
      else {
        this.allParfumes = parfumes;

        for (let j = 0; j < this.allParfumes.length; j++) {
          /*this.allParfumes[j].date = new Date(this.allParfumes[j].date);
          this.index[j] = j;

          if (this.allParfumes[j].participants != null) {
            for (let k = 0; k < this.allParfumes[j].participants.length; k++)
              if ((this.allParfumes[j].participants[k].mail == this.current_user.mail) && this.allParfumes[j].date > new Date()) {
                if(this.allParfumes[j].participants[k].status != "notify")
                this.myParfumes.push(this.allParfumes[j]);
                break;
              }

          }*/

        }
      }
    });
  }

}
