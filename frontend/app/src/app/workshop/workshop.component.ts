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
  top5: String[] = [];

  getTop5() {
    this.filtered_workshops.sort((a, b) => {
      return a.likes - b.likes;
    });
  }

  getAllWorkshops() {
    this.workshop_service.getAllWorkshops().subscribe((workshops: WorkshopDetails[]) => {
      if (!workshops) alert("Error");
      else {
        this.allWorkshops = workshops;
        this.filtered_workshops = this.allWorkshops;
        for (var i = 0; i < this.filtered_workshops.length; i++) {
          this.index[i] = i;
          let t1 = new String(this.allWorkshops[i].date);
          const [month, day, year] = t1.toString().split('.');
          let temp = new Date(+year, +month - 1, +day);
          this.allWorkshops[i].date = temp;
        }
        this.getTop5();
        for (let i = 0; i < 5 && i < this.filtered_workshops.length; i++) {
          if (this.top5.indexOf(workshops[i].name) === -1)
            this.top5.push(workshops[i].name)
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
    } else if (this.toggle1 == true) {
      this.filtered_workshops.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
      this.toggle1 = false;
    }
  }

  sortDate() {

    if (this.toggle2 == false) {
      this.filtered_workshops.sort((a, b) => {
        let g = new Date(b.date).getTime();
        let h = new Date(a.date).getTime();
        return  g - h
      });
      this.toggle2 = true;
    } else if (this.toggle2 == true) {
      this.filtered_workshops.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      });
      this.toggle2 = false;
    }
  }
  str1: string;
  searchName(param) {
    this.filtered_workshops = this.allWorkshops.filter(workshop => workshop.name.toLowerCase().includes(param.toLowerCase()));
    this.searchFlag = true;
  }
  str2: string;
  searchLocation(param) {
    this.filtered_workshops = this.allWorkshops.filter(workshop => workshop.location.toLowerCase().includes(param.toLowerCase()));
    this.searchFlag = true;
  }
}
