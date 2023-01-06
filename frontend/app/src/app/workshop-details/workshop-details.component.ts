import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { WorkshopDetails } from '../models/workshop-details';


@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.css']
})
export class WorkshopDetailsComponent implements OnInit{

  @Input() myWorkshopDetail: WorkshopDetails;
  @Input() myIndex: number;

  constructor(private _router: Router){}

  current_user:User;
  type :string = "";

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    if(this.current_user != null){
      this.type = this.current_user.type;
    }
  }

  Toggle(): boolean {

    if (this.myIndex % 2 == 0)
      return true;
    else return false;

  }

  add_Workshop() {
    localStorage.setItem("sent_workshop", JSON.stringify(this.myWorkshopDetail));
    this._router.navigate(["admin/edit_workshop"]);
  }

  toMonthName(monthNumber):string {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', {
      month: 'short',
    });
  }
}
