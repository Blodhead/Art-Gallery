import { Component, OnInit } from '@angular/core';
import { WorkshopDetails } from '../models/workshop-details';
import { WorkshopService } from '../workshop.service';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.css']
})
export class WorkshopComponent implements OnInit {

  constructor(private workshop_service: WorkshopService) { }

  ngOnInit(): void {
    this.getAllWorkshops();
  }

  toggle1: boolean = true;
  toggle2: boolean = true;
  searchFlag: boolean = false;

  filtered_workshops: WorkshopDetails[];
  allWorkshops: WorkshopDetails[];
  index: number[] = [1];

  getAllWorkshops() {
    this.workshop_service.getAllWorkshops().subscribe((workshops: WorkshopDetails[]) => {
      if (!workshops) alert("Error");
      else {
        this.allWorkshops = workshops;
        this.filtered_workshops = this.allWorkshops;
        for (var i = 0; i < this.filtered_workshops.length; i++) {
          this.index[i] = i;
        }
      }
    });
  }

  sortName() {
    if (this.toggle1 == false) {
      this.filtered_workshops.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      this.toggle1 = true;
    }else if(this.toggle1 == true){
      this.filtered_workshops.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
      this.toggle1 = false;
    }
  }

  sortDate() {

    if(this.toggle2 == false){
      this.filtered_workshops.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      });
      this.toggle2 = true;
    }else if(this.toggle2 == true){
      this.filtered_workshops.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      });
      this.toggle2 = false;
    }
  }
  str1: string;
  searchName(param) {
    this.filtered_workshops = this.allWorkshops.filter(workshop => workshop.name.includes(param));
    this.searchFlag = true;
  }
  str2: string;
  searchLocation(param) {
    this.filtered_workshops = this.allWorkshops.filter(workshop => workshop.location.includes(param));
    this.searchFlag = true;
  }
}
