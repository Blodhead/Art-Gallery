import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as noUiSlider from 'nouislider';
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

export class ParfumeComponent implements OnInit, AfterViewInit {
  @ViewChild('priceSlider', { static: false }) priceSlider: ElementRef;
  @ViewChild('parfumeGrid', { static: false }) parfumeGrid: ElementRef;
  constructor(private _router: Router, private parfume_service: ParfumeService, private sharedService: SharedService) { }
  reload: string;
  toggle1: boolean = true;
  toggle2: boolean = true;
  searchFlag: boolean = false;
  current_path: string;
  allParfumes: ParfumeDetails[] = [];
  filtered_parfumes: ParfumeDetails[] = [];
  displayed_parfumes: ParfumeDetails[] = [];
  index: number[] = [1];
  top5: String[] = [];
  temp_date: Date[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  nameFilter: string = '';
  priceMin: number = 0;
  priceMax: number = 0;
  priceFilterMin: number = 0;
  priceFilterMax: number = 0;
  priceSliderInstance: any = null;

  filtersVisible = true;

toggleFilters() {
  if (this.filtersVisible && this.priceSliderInstance) {
    // destroy before hiding
    this.priceSliderInstance.destroy();
    this.priceSliderInstance = null;
  }

  this.filtersVisible = !this.filtersVisible;

  // reinitialize when shown again
  if (this.filtersVisible) {
    setTimeout(() => this.initNoUiSlider(), 0);
  }
}


  ngOnInit(): void {
    this.current_path = this._router.url.split('/').pop();
    this.reload = localStorage.getItem("reload");
    if (this.reload == "true") {
      localStorage.removeItem("reload");
      this.sharedService.sendclickEvent();
    }
    this.getAllParfumes();
    // No scroll event needed for pagination
  }

  ngOnDestroy(): void {
    // No scroll event needed for pagination
  }

  getAllParfumes() {
    this.parfume_service.getAllParfumes().subscribe((parfumes: any[]) => {
      if (!parfumes) alert("Error");
      else {
        this.allParfumes = parfumes.map((p: any) => ({
          name: p.name,
          img_location: p.img_location ? (p.img_location.startsWith('http') ? p.img_location : `${p.img_location}`) : '',
          price: p.price,
          amount: p.amount,
          description: p.description || '',
          status: p.status || '',
          _id: p._id || ''
        }));
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
        // Set price range
        if (this.allParfumes.length > 0) {
          this.priceMin = Math.min(...this.allParfumes.map(p => p.price));
          this.priceMax = Math.max(...this.allParfumes.map(p => p.price));
        } else {
          this.priceMin = 0;
          this.priceMax = 0;
        }
        this.priceFilterMin = this.priceMin;
        this.priceFilterMax = this.priceMax;
        setTimeout(() => this.initNoUiSlider(), 0);
        this.applyFilters();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initNoUiSlider();
  }

  initNoUiSlider(): void {
    if (!this.priceSlider || this.priceSliderInstance || this.priceMin === this.priceMax) return;
    this.priceSliderInstance = noUiSlider.create(this.priceSlider.nativeElement, {
      start: [this.priceFilterMin, this.priceFilterMax],
      connect: true,
      step: 1,
      range: {
        min: this.priceMin,
        max: this.priceMax
      },
      tooltips: [true, true],
      format: {
        to: (value: number) => Math.round(value),
        from: (value: string) => Number(value)
      }
    });
    this.priceSliderInstance.on('update', (values: string[]) => {
      this.priceFilterMin = Number(values[0]);
      this.priceFilterMax = Number(values[1]);
      this.applyFilters();
    });
  }




  updatePagination(): void {
    this.totalPages = Math.ceil(this.filtered_parfumes.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayed_parfumes = this.filtered_parfumes.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
    this.scrollGridTop();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
      this.scrollGridTop();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
      this.scrollGridTop();
    }
  }

  private scrollGridTop(): void {
    try {
      if (this.parfumeGrid && this.parfumeGrid.nativeElement) {
        this.parfumeGrid.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (e) {
      // ignore in case of any runtime issues
    }
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
    this.updatePagination();
  }

  sortPrice() {
    if (this.toggle2 == false) {
      this.filtered_parfumes.sort((a, b) => a.price - b.price);
      this.toggle2 = true;
    } else if (this.toggle2 == true) {
      this.filtered_parfumes.sort((a, b) => b.price - a.price);
      this.toggle2 = false;
    }
    this.updatePagination();
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

  onNameFilterChange(value: string) {
    this.nameFilter = value;
    this.applyFilters();
  }

  onPriceFilterChange(): void {
    this.applyFilters();
  }

  applyFilters() {
    this.filtered_parfumes = this.allParfumes.filter(parfume => {
      const nameMatch = parfume.name.toLowerCase().includes(this.nameFilter.toLowerCase());
      const priceMatch = parfume.price >= this.priceFilterMin && parfume.price <= this.priceFilterMax;
      return nameMatch && priceMatch;
    });
    this.currentPage = 1;
    this.updatePagination();
  }

}
