import { Component, OnInit } from '@angular/core';
import { WorkshopDetails } from '../models/workshop-details';
import { SharedService } from '../shared.service';
import { WorkshopService } from '../workshop.service';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.css']
})
export class WorkshopComponent implements OnInit {

  constructor(private workshop_service: WorkshopService, private sharedService: SharedService) { }
  reload: string;
  ngOnInit(): void {

    this.reload = localStorage.getItem("reload");
    if (this.reload == "true") {
      localStorage.removeItem("reload");
      this.sharedService.sendclickEvent();
    }
    this.getAllWorkshops();
  }

  toggle1: boolean = true;
  toggle2: boolean = true;
  searchFlag: boolean = false;

  filtered_workshops: WorkshopDetails[];
  allWorkshops: WorkshopDetails[];
  index: number[] = [1];
  top5: String[] = [];
  temp_date: Date[] = [];
  getTop5() {
    this.filtered_workshops.sort((a, b) => {
      return a.likes.length - b.likes.length;
    });
  }

  getAllWorkshops() {
    this.workshop_service.getAllWorkshops().subscribe((workshops: WorkshopDetails[]) => {
      if (!workshops) alert("Error");
      else {
        this.allWorkshops = workshops;
        this.filtered_workshops = this.allWorkshops;
        this.getTop5();

        for (let i = 0; i < 5 && i < this.filtered_workshops.length; i++) {
          if (this.top5.indexOf(workshops[i].name) === -1)
            this.top5.push(workshops[i].name)
        }

        for (let j = 0; j < this.allWorkshops.length; j++) {
          this.allWorkshops[j].date = new Date(this.allWorkshops[j].date);
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
        return g - h
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
