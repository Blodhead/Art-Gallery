import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { MapService } from '../map.service';
import { User } from '../models/user';
import { ParfumeDetails } from '../models/parfume-details';
import { ParfumeService } from '../parfume.service';

declare var ol: any;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  template: `<gallery [items]="images"></gallery>`,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor(private map_service: MapService, private parfume_service: ParfumeService, private _router: Router) { }
  latitude: number = 20.4762358;
  longitude: number = 44.8057154;
  ngOnInit(): void {
    this.myParfume = JSON.parse(localStorage.getItem("detail_sent"));
    this.current_user = JSON.parse(localStorage.getItem("current_user"));

    if (this.current_user == null) this._router.navigate(["login"]);
    if (this.myParfume == null) this._router.navigate([""]);

    //this.bgimage = this.myParfume.image;
    this.images = this.getImages();
    //this.long_desc = this.myParfume.long_desc;
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

    /*for (let i = 0; i < this.myParfume.participants.length; i++) {
      if (this.myParfume.participants[i].status == "waiting")
        this.waitingParticipants.push(this.myParfume.participants[i].mail);
      else if (this.myParfume.participants[i].status == "approved")
        this.subscribedParticipants.push(this.myParfume.participants[i].mail);
    }*/

  }

  myParfume: ParfumeDetails = null;
  images: GalleryItem[] = [];
  map: any;
  long_desc: String;
  bgimage: string;
  current_user: User;
  waitingParticipants: string[] = [];
  subscribedParticipants: string[] = [];

  getImages(): GalleryItem[] {
    /*let temp_gallery: GalleryItem[] = [];
    for (let i = 0; i < this.myParfume.gallery.length; i++) {
      temp_gallery.push(new ImageItem({ src: this.myParfume.gallery[i], thumb: this.myParfume.gallery[i] }));
    }
    if (this.myParfume.gallery.length == 0) {
      temp_gallery.push(new ImageItem({ src: this.myParfume.image, thumb: this.myParfume.image }));
    }
    return temp_gallery;*/
    return null;
  }
  err_message: string = '';
  search() {
    /*this.map_service.getLongLat(this.myParfume.location).subscribe((address: any) => {

      if (address.features[0] == null) { this.err_message = "Location doesn't exist!"; return; }
      this.err_message = '';
      this.latitude = address.features[0].geometry.coordinates[1];
      this.longitude = address.features[0].geometry.coordinates[0];

      this.setCenter();
    });*/
  }

  setCenter() {
    var view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat([this.longitude, this.latitude]));
    view.setZoom(17);
  }

  /*check() {
    if (this.current_user.type == "organizer" && this.current_user.username == this.myParfume.owner)
      return true;
    else return false;
  }*/

  reject(participant: string) {
    for (let iter = 0; iter < this.waitingParticipants.length; iter++) {
      if (this.waitingParticipants[iter] == participant) {

        /*for (let x = 0; x < this.myParfume.participants.length; x++) {
          if (this.myParfume.participants[x].mail == this.waitingParticipants[iter]) {
            this.myParfume.participants[x] = null;
            break;
          }

        }*/

        /*this.myParfume.participants = this.myParfume.participants.filter(elements => {
          return (elements != null && elements !== undefined);
        });*/

        localStorage.setItem("detail_sent", JSON.stringify(this.myParfume));

        this.waitingParticipants[iter] = null;
        this.waitingParticipants = this.waitingParticipants.filter(elements => {
          return (elements != null && elements !== undefined);
        });
        break;
      }
    }

    /*this.parfume_service.reject(participant, this.myParfume).subscribe((statement) => {
      if (statement) localStorage.setItem("detail_sent", JSON.stringify(this.myParfume));
      else alert("err");
    });*/

  }
  accept(participant) {

    /*for (let iter = 0; iter < this.waitingParticipants.length; iter++) {
      if (this.waitingParticipants[iter] == participant) {
        for (let x = 0; x < this.myParfume.participants.length; x++) {
          if (this.myParfume.participants[x].mail == this.waitingParticipants[iter]) {
            this.myParfume.participants[x].status = "approved";
            break;
          }

        }
        localStorage.setItem("detail_sent", JSON.stringify(this.myParfume));
        this.waitingParticipants[iter] = null;
        this.waitingParticipants = this.waitingParticipants.filter(elements => {
          return (elements != null && elements !== undefined);
        });
        break;
      }
    }*/

    this.subscribedParticipants.push(participant);

    this.parfume_service.accept(participant, this.myParfume).subscribe((statement) => {
      if (statement) localStorage.setItem("detail_sent", JSON.stringify(this.myParfume));

      else alert("err");
    });
  }

  contact() {
    localStorage.setItem("sent_parfume", JSON.stringify(this.myParfume));
    this._router.navigate(["chat"]);
  }

}
