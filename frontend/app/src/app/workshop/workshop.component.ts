import { Component, OnInit } from '@angular/core';
import { WorkshopDetails } from '../models/workshop-details';
import { WorkshopService } from '../workshop.service';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.css']
})
export class WorkshopComponent implements OnInit{

  constructor(private workshop_service:WorkshopService){}

  ngOnInit(): void {
    this.getAllWorkshops();
  }

  toggle1: boolean = true;
  toggle2: boolean = true;
  searchFlag: boolean = false;

  filtered_workshops: WorkshopDetails[] = [];
  allWorkshops:WorkshopDetails[];


  getAllWorkshops(){
    this.workshop_service.getAllWorkshops().subscribe((workshops: WorkshopDetails[])=>{
      if(!workshops) alert("Error");
      else{
        this.allWorkshops = workshops;
        this.filtered_workshops = this.allWorkshops;
      }
    });
  }

  sortName(){

  }

  sortDate(){

  }

  searchName(){

  }

  searchLocation(){

  }
}
