import { Component, OnInit } from '@angular/core';
import { GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  template: `<gallery [items]="images"></gallery>`,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  ngOnInit(): void {
    this.images = this.getImages();
  }
  images: GalleryItem[] = null;

  getImages(): GalleryItem[]{
    return null;
  }

}
