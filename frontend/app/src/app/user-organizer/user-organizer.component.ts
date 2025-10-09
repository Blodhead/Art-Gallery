import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { ParfumeDetails } from '../models/parfume-details';
import { SharedService } from '../shared.service';
import { ParfumeService } from '../parfume.service';

@Component({
  selector: 'app-user-organizer',
  templateUrl: './user-organizer.component.html',
  styleUrls: ['./user-organizer.component.css']
})
export class UserOrganizerComponent implements OnInit {
  constructor(private parfume_service: ParfumeService, private sharedService: SharedService, private _router: Router) { }

  current_user: User = null;
  reload: string = "";
  allParfumes: ParfumeDetails[] = [];

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    if (this.current_user == null) this._router.navigate(["login"]);
    if (this.current_user.type != "organizer") this._router.navigate([""]);
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

        for (let j = 0; j < parfumes.length; j++) {
          parfumes[j].date = new Date(parfumes[j].date);
            if (parfumes[j].status == "approved" && (parfumes[j].owner == this.current_user.username))
              this.allParfumes.push(parfumes[j]);
        }
      }
    });
  }

  add_new(){

    localStorage.removeItem("sent_parfume");
    this._router.navigate(["admin/edit_parfume"]);
  }

}
