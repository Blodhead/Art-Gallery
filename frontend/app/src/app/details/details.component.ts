import { Component, OnInit } from '@angular/core';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { MapService } from '../map.service';
import { WorkshopDetails } from '../models/workshop-details';

declare var ol: any;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  template: `<gallery [items]="images"></gallery>`,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor(private map_service: MapService) { }
  latitude: number = 18.5204;
  longitude: number = 73.8567;
  ngOnInit(): void {
    this.myWorkshop = JSON.parse(localStorage.getItem("detail_sent"));
    this.images = this.getImages();

    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.latitude, this.longitude]),
        zoom: 8
      })
    });

  }

  myWorkshop: WorkshopDetails = null;
  images: GalleryItem[] = [];
  map: any;




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
  address: string;
  search() {
    this.map_service.getLongLat(this.address).subscribe((address:any) => {

      this.latitude = address.features[0].geometry.coordinates[1];
      this.longitude = address.features[0].geometry.coordinates[0];
   
      this.setCenter();
    });
  }

  setCenter() {
    var view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat([this.longitude, this.latitude]));
    view.setZoom(17);
  }

}
