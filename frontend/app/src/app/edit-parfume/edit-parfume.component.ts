import { Component, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { User } from '../models/user';
import { ParfumeDetails } from '../models/parfume-details';
import { ParfumeService } from '../parfume.service';
import * as _ from 'lodash';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from "@angular/common/http";
import { MapService } from '../map.service';
import { subscribeOn } from 'rxjs';


@Component({
  selector: 'app-edit-parfume',
  templateUrl: './edit-parfume.component.html',
  styleUrls: ['./edit-parfume.component.css']
})
export class EditParfumeComponent implements OnInit {

  constructor(private service: ParfumeService, private _router: Router, private sanitizer: DomSanitizer, private httpClient: HttpClient, private map_service: MapService) { }

  current_user: User;
  sent_parfume: ParfumeDetails = null;
  Error_message: string;

  imageError: string;
  cardImageBase64: string;
  isImageSaved: boolean;

  name: string;
  choosen_Date: Date;
  date: Date;
  image: string;
  location: string;
  description: string;
  time: string;
  likes: string[] = [];
  gallery: string[] = [];
  long_desc: string = "";
  free_spaces: number = 0;
  owner: string;
  allParfumes: ParfumeDetails[] = [];
  global_index: number = -1;
  template_parfume: ParfumeDetails = null;
  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    this.sent_parfume = JSON.parse(localStorage.getItem("sent_parfume"));
    if (!this.sent_parfume)
      this.template_parfume = JSON.parse(localStorage.getItem("template_parfume"));

    if (this.current_user == null) this._router.navigate(["login"]);

    if (this.sent_parfume != null) {
      this.name = this.sent_parfume.name;
      this.date = new Date(this.sent_parfume.date);
      this.image = this.sent_parfume.image;
      this.time = this.date.getHours() + ":" + this.date.getMinutes();
      this.location = this.sent_parfume.location;
      this.description = this.sent_parfume.description;
      this.free_spaces = this.sent_parfume.free_spaces;
      this.long_desc = this.sent_parfume.long_desc;
      this.owner = this.sent_parfume.owner;
    }

    if (this.template_parfume != null) {
      this.name = this.template_parfume.name;
      this.date = new Date(this.template_parfume.date);
      this.image = this.template_parfume.image;
      this.time = this.date.getHours() + ":" + this.date.getMinutes();
      this.location = this.template_parfume.location;
      this.description = this.template_parfume.description;
      this.free_spaces = this.template_parfume.free_spaces;
      this.long_desc = this.template_parfume.long_desc;
      this.owner = this.template_parfume.owner;
    }
  }

  onFileSelected(event) {

    if (this.sent_parfume != null)
      this.sent_parfume.gallery = [];

    const allowed_types = ['image/png', 'image/jpeg'];
    let temp_gallery: string[] = [];
    for (let i = 0; i < event.target.files.length; i++) {

      if (!_.includes(allowed_types, event.target.files[i].type)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
        alert(this.imageError);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      this.image = "../../assets/images/" + event.target.files[0].name;
      temp_gallery.push("../../assets/images/" + event.target.files[i].name);
    }

    this.gallery = temp_gallery;

    if (this.sent_parfume != null) {
      this.sent_parfume.gallery = this.gallery;
      this.sent_parfume.image = this.gallery[0];
    }
  }

  cancel() {
    localStorage.removeItem("sent_parfume");
    localStorage.removeItem("template_parfume");
    this._router.navigate([""]);
  }
  mydate: string;

  check() {
    this.Error_message = "Input error:\n";

    if (this.name == null) {
      this.Error_message += "Parfume name missing\n"
    }

    if (this.location == null) {
      this.Error_message += "Parfume location missing\n"
    } else {
      this.map_service.getLongLat(this.location).subscribe((address: any) => {
        if (address.features[0] == null) { this.Error_message += "Location doesn't exist!"; return; }
      });
    }

    if (this.gallery == null) {
      this.Error_message += "Parfume image missing\n"
    }

    if (this.date == null) {
      this.Error_message += "Parfume date missing\n"
    }

    if (this.time == null) {
      this.Error_message += "Parfume time missing\n"
    }

    if (this.description == null) {
      this.Error_message += "Parfume short description missing\n"
    }

    if (this.long_desc == null) {
      this.Error_message += "Parfume long description missing\n"
    }

  }

  save() {

    this.check();

    if (this.Error_message != "Input error:\n") {
      alert(this.Error_message);
      return;
    }

    this.service.getAllParfumes().subscribe((parfumes: ParfumeDetails[]) => {
      for (let j = 0; j < parfumes.length; j++) {
        parfumes[j].date = new Date(parfumes[j].date);
        this.allParfumes.push(parfumes[j]);
      }

      for (let i = 0; i < this.allParfumes.length; i++) {
        if (this.allParfumes[i].name == this.name) {
          this.likes = this.allParfumes[i].likes;
          break;
        }
      }

      localStorage.removeItem("sent_parfume");
      localStorage.removeItem("template_parfume");

      let arr = this.time.split(":");
      this.mydate = this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + this.date.getDate();
      let temp_date = new Date(this.mydate);
      temp_date.setHours(Number(arr[0]), Number(arr[1]), 0);
      if (this.sent_parfume == null || this.template_parfume != null) {
        this.service.save(this.name, this.image, this.description, temp_date, this.location, this.likes, this.gallery, this.long_desc, this.current_user.username, this.free_spaces).subscribe((parfume: ParfumeDetails) => {
          if (parfume != null) {
            alert("Reguest successful");
            this.cancel();
          }
          else alert("ERROR");
        });


      }
      else if (this.sent_parfume != null) {
        this.service.update(this.sent_parfume.name, this.name, this.image, this.description, temp_date, this.location, this.likes, this.sent_parfume.gallery, this.long_desc, this.owner, this.free_spaces).subscribe((parfume: ParfumeDetails) => {
          if (parfume != null) {
            alert("Update successful");
          }
          else alert("ERROR");

        });
      }



    });





  }

  remove() {
    if (this.sent_parfume == null) { alert("There is nothing to delete!"); return; }

    //alert all subscribed users
    let mailing_list: string[] = [];
    for (let i = 0; i < this.sent_parfume.participants.length; i++) {
      mailing_list.push(this.sent_parfume.participants[i].mail);
    }

    this.service.informAll(mailing_list, this.sent_parfume.name).subscribe((statement) => {
      if (statement != null) this.cancel();
      else alert("Error while deleting");
    });


    this.service.delete(this.sent_parfume).subscribe((statement) => {
      if (statement != null) this.cancel();
      else alert("Error while deleting");
      this.cancel();
    });

  }

  downloadJsonHref: SafeUrl;
  uri: SafeUrl;

  saveAsTemplate() {

    this.check();

    if (this.Error_message != "Input error:\n") {
      alert(this.Error_message);
      return;
    }

    let temp = new ParfumeDetails;
    temp.name = this.name;
    temp.date = this.date;
    temp.description = this.description;
    temp.image = this.image;
    temp.location = this.location;
    temp.gallery = this.gallery;
    temp.likes = this.likes;
    temp.long_desc = this.long_desc;
    temp.free_spaces = this.free_spaces;

    var theJSON = JSON.stringify([temp]);
    this.uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
    this.downloadJsonHref = this.uri;

  }

  selectedFile: string;
  jsonerror: string;
  products: any;

  onFileChanged(event) {
    const allowed_types = ['application/json'];

    if (!_.includes(allowed_types, event.target.files[0].type)) {
      this.jsonerror = 'Only Sripts are allowed ( JSON )';
      alert(this.jsonerror);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = rs => {

        const imgBase64Path = e.target.result;
        this.cardImageBase64 = imgBase64Path;
        this.isImageSaved = true;
        // this.previewImagePath = imgBase64Path;

      };
    };
    reader.readAsDataURL(event.target.files[0]);

    this.selectedFile = event.target.files[0].name;
    this.httpClient.get("assets/" + this.selectedFile).subscribe(data => {
      console.log(data);
      this.products = data;
      localStorage.setItem("template_parfume", JSON.stringify(this.products[0]));
      location.reload();
    });


  }

}
