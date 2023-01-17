import { Component, OnInit } from '@angular/core';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { WorkshopDetails } from '../models/workshop-details';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  template: `<gallery [items]="images"></gallery>`,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  ngOnInit(): void {
    this.myWorkshop = JSON.parse(localStorage.getItem("detail_sent"));
    this.images = this.getImages();
  }

  myWorkshop: WorkshopDetails = null;
  images: GalleryItem[] = [];

  getImages(): GalleryItem[] {
    let temp_gallery: GalleryItem[] = [];
    for (let i = 0; i < this.myWorkshop.gallery.length; i++) {
      temp_gallery.push(new ImageItem({ src: this.myWorkshop.gallery[i], thumb: this.myWorkshop.gallery[i] }));
    }
    if (this.myWorkshop.gallery.length == 0) {
      temp_gallery.push(new ImageItem({ src: this.myWorkshop.image, thumb: this.myWorkshop.image }));
    }
    return temp_gallery;
  }

}
