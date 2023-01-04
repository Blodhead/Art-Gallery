import { Component, Input } from '@angular/core';
import { WorkshopDetails } from '../models/workshop-details';


@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.css']
})
export class WorkshopDetailsComponent {

  @Input() myWorkshopDetail: WorkshopDetails;
  @Input() myIndex: number;

  Toggle(): boolean {

    if (this.myIndex % 2 == 0)
      return true;
    else return false;

  }

  toMonthName(monthNumber):string {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', {
      month: 'short',
    });
  }
}
