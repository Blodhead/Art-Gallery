import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParfumeDetails } from '../models/parfume-details';
import { SharedService } from '../shared.service';
import { ParfumeService } from '../parfume.service';
import { Parfume } from '../models/parfumes';

@Component({
  selector: 'app-parfume',
  templateUrl: './parfume.component.html',
  styleUrls: ['./parfume.component.css']
})
export class ParfumeComponent implements OnInit {

  constructor(private _router: Router, private parfume_service: ParfumeService, private sharedService: SharedService) { }
  reload: string;
  ngOnInit(): void {
    this.current_path = this._router.url.split('/').pop();
    this.reload = localStorage.getItem("reload");
    if (this.reload == "true") {
      localStorage.removeItem("reload");
      this.sharedService.sendclickEvent();
    }
    this.getAllParfumes();
  }

  toggle1: boolean = true;
  toggle2: boolean = true;
  searchFlag: boolean = false;
  current_path: string;
  filtered_parfumes: ParfumeDetails[] = [];
  allParfumes: ParfumeDetails[] = [];
  index: number[] = [1];
  top5: String[] = [];
  temp_date: Date[] = [];


  getAllParfumes() {
    this.parfume_service.getAllParfumes().subscribe((parfumes: any[]) => {
      if (!parfumes) alert("Error");
      else {
        // Map backend Parfume objects to ParfumeDetails for card display
        this.allParfumes = parfumes.map((p: any) => ({
          name: p.name,
          img_location: p.img_location ? (p.img_location.startsWith('http') ? p.img_location : `${p.img_location}`) : '',
          price: p.price,
          amount: p.amount,
          description: p.description || '',
          status: p.status || '',
          _id: p._id || ''
        }));

        // Top 5 by name (or any other logic)
        let bridge = this.allParfumes.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.name === value.name
          ))
        );
        this.top5 = [];
        for (let i = 0; i < 5 && i < bridge.length; i++) {
          if (this.top5.indexOf(bridge[i].name) === -1)
            this.top5.push(bridge[i].name)
        }

        this.filtered_parfumes = [...this.allParfumes];
      }
    });
  }

  /*getAllParfumes() {
    this.parfume_service.getAllParfumes().subscribe((parfumes: ParfumeDetails[]) => {
      if (!parfumes) alert("Error");
      else {

        let temp_arr = parfumes;

        temp_arr.sort((a, b) => {
          return b.likes.length - a.likes.length;
        });

        let bridge = temp_arr;

        bridge = bridge.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.name === value.name
          ))
        )

        for (let i = 0; i < 5 && i < bridge.length; i++) {
          if (this.top5.indexOf(bridge[i].name) === -1)
            this.top5.push(bridge[i].name)
        }

        for (let j = 0; j < temp_arr.length; j++) {
          temp_arr[j].date = new Date(temp_arr[j].date);
          if (this.current_path == "" && (temp_arr[j].date.getTime() - (new Date()).getTime()) > 0)
            if (parfumes[j].status == 'approved')
              this.allParfumes[j] = temp_arr[j];
        }

        this.allParfumes = this.allParfumes.filter(elements => {
          return (elements != null && elements !== undefined);
        });
        this.filtered_parfumes = this.allParfumes;
      }
    });
  }*/

  sortName() {
    if (this.toggle1 == false) {
      this.filtered_parfumes.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      this.toggle1 = true;
    } else if (this.toggle1 == true) {
      this.filtered_parfumes.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
      this.toggle1 = false;
    }
  }

  sortDate() {

    /*if (this.toggle2 == false) {
      this.filtered_parfumes.sort((a, b) => {
        let g = new Date(b.date).getTime();
        let h = new Date(a.date).getTime();
        return g - h
      });
      this.toggle2 = true;
    } else if (this.toggle2 == true) {
      this.filtered_parfumes.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      });
      this.toggle2 = false;
    }*/
  }
  str1: string;
  searchName(param) {
    this.filtered_parfumes = this.filtered_parfumes.filter(parfume => parfume.name.toLowerCase().includes(param.toLowerCase()));
    this.searchFlag = true;
  }
  str2: string;
  searchLocation(param) {
    /*this.filtered_parfumes = this.filtered_parfumes.filter(parfume => parfume.location.toLowerCase().includes(param.toLowerCase()));
    this.searchFlag = true;*/
  }

  search(param) {
    /*this.filtered_parfumes = this.allParfumes;
    if (this.str1 != null) {
      this.filtered_parfumes = this.filtered_parfumes.filter(parfume => parfume.name.toLowerCase().includes(param.toLowerCase()));
    } else if (this.str2 != null) {
      this.filtered_parfumes = this.filtered_parfumes.filter(parfume => parfume.location.toLowerCase().includes(param.toLowerCase()));
    }
    this.searchFlag = true;*/
  }

}
