import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { MapService } from '../map.service';
import { User } from '../models/user';
import { WorkshopDetails } from '../models/workshop-details';
import { WorkshopService } from '../workshop.service';

declare var ol: any;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  template: `<gallery [items]="images"></gallery>`,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor(private map_service: MapService, private workshop_service: WorkshopService, private _router: Router) { }
  latitude: number = 20.4762358;
  longitude: number = 44.8057154;
  ngOnInit(): void {
    this.myWorkshop = JSON.parse(localStorage.getItem("detail_sent"));
    this.current_user = JSON.parse(localStorage.getItem("current_user"));

    if (this.current_user == null) this._router.navigate(["login"]);
    if (this.myWorkshop == null) this._router.navigate([""]);

    this.bgimage = this.myWorkshop.image;
    this.images = this.getImages();
    this.long_desc = this.myWorkshop.long_desc;
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.latitude, this.longitude]),
        zoom: 17
      })
    });
    this.search();

    for (let i = 0; i < this.myWorkshop.participants.length; i++) {
      if (this.myWorkshop.participants[i].status == "waiting")
        this.waitingParticipants.push(this.myWorkshop.participants[i].mail);
      else if (this.myWorkshop.participants[i].status == "approved")
        this.subscribedParticipants.push(this.myWorkshop.participants[i].mail);
    }

  }

  myWorkshop: WorkshopDetails = null;
  images: GalleryItem[] = [];
  map: any;
  long_desc: String;
  bgimage: string;
  current_user: User;
  waitingParticipants: string[] = [];
  subscribedParticipants: string[] = [];

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
  err_message: string = '';
  search() {
    this.map_service.getLongLat(this.myWorkshop.location).subscribe((address: any) => {

      if (address.features[0] == null) { this.err_message = "Location doesn't exist!"; return; }
      this.err_message = '';
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

  check() {
    if (this.current_user.type == "organizer" && this.current_user.username == this.myWorkshop.owner)
      return true;
    else return false;
  }

  reject(participant: string) {
    for (let iter = 0; iter < this.waitingParticipants.length; iter++) {
      if (this.waitingParticipants[iter] == participant) {
        this.waitingParticipants[iter] = null;
        this.waitingParticipants = this.waitingParticipants.filter(elements => {
          return (elements != null && elements !== undefined);
        });
        break;
      }
    }

    this.workshop_service.reject(participant, this.myWorkshop).subscribe((statement) => {
      if (statement) alert("uspehg");
      else alert("err");
    });

  }
  accept(participant) {

    for (let iter = 0; iter < this.waitingParticipants.length; iter++) {
      if (this.waitingParticipants[iter] == participant) {
        this.waitingParticipants[iter] = null;
        this.waitingParticipants = this.waitingParticipants.filter(elements => {
          return (elements != null && elements !== undefined);
        });
        break;
      }
    }

    this.subscribedParticipants.push(participant);

    this.workshop_service.accept(participant, this.myWorkshop).subscribe((statement) => {
      if (statement) alert("uspehg");
      else alert("err");
    });
  }

  contact() { }

}
