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

    if(this.myIndex % 2 == 0)
      return true;
      else return false; 

  }
}
