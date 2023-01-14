import { Component, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { User } from '../models/user';
import { WorkshopDetails } from '../models/workshop-details';
import { WorkshopService } from '../workshop.service';
import * as _ from 'lodash';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'app-edit-workshop',
  templateUrl: './edit-workshop.component.html',
  styleUrls: ['./edit-workshop.component.css']
})
export class EditWorkshopComponent implements OnInit {

  constructor(private service: WorkshopService, private _router: Router, private sanitizer: DomSanitizer, private httpClient: HttpClient) {}

  current_user: User;
  sent_workshop: WorkshopDetails;
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

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    this.sent_workshop = JSON.parse(localStorage.getItem("sent_workshop"));

    if (this.sent_workshop != null) {
      this.name = this.sent_workshop.name;
      this.date = new Date(this.sent_workshop.date);
      this.image = this.sent_workshop.image;
      this.location = this.sent_workshop.location;
      this.description = this.sent_workshop.description;
    }
  }

  onFileSelected(event) {
    const allowed_types = ['image/png', 'image/jpeg'];
    if (!_.includes(allowed_types, event.target.files[0].type)) {
      this.imageError = 'Only Images are allowed ( JPG | PNG )';
      alert(this.imageError);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.image = "../../assets/images/" + event.target.files[0].name;
  }

  cancel() {
    localStorage.removeItem("sent_workshop");
    this._router.navigate([""]);
  }
  mydate: string;


  check() {
    this.Error_message = "Input error:\n";

    if (this.name == null) {
      this.Error_message += "Workshop name missing\n"
    }

    if (this.location == null) {
      this.Error_message += "Workshop location missing\n"
    }

    if (this.image == null) {
      this.Error_message += "Workshop image missing\n"
    }

    if (this.date == null) {
      this.Error_message += "Workshop date missing\n"
    }

    if (this.time == null) {
      this.Error_message += "Workshop time missing\n"
    }

    if (this.description == null) {
      this.Error_message += "Workshop description missing\n"
    }
  }

  save() {

    this.check();

    if (this.Error_message != "Input error:\n") {
      alert(this.Error_message);
      return;
    }
    let arr = this.time.split("");
    this.mydate = (this.date.getMonth() + 1) + " " + this.date.getDate() + " " + this.date.getFullYear();

    new Date();
    if (this.sent_workshop == null)
      this.service.save(this.name, this.image, this.description, this.date, this.location, this.likes).subscribe((workshop) => {
        if (workshop != null) {
          alert("Register acknowledged");
          this.cancel();
        }
        else alert("ERROR");
      });
    else if (this.sent_workshop != null) {
      this.service.update(this.sent_workshop.name, this.name, this.image, this.description, this.date, this.location, this.likes).subscribe((workshop) => {
        if (workshop != null) {
          alert("Changes made");
          this.cancel();
        }
        else alert("ERROR");

      });
    }


  }

  remove() {
    if (this.sent_workshop == null) { alert("There is nothing to delete!"); return; }

    //alert all subscribed users

    this.service.delete(this.sent_workshop).subscribe((statement) => {
      if (statement != null) this.cancel();
      else alert("Error while deleting");
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

    let temp = new WorkshopDetails;
    temp.name = this.name;
    temp.date = this.date;
    temp.description = this.description;
    temp.image = this.image;
    temp.location = this.location;

    var theJSON = JSON.stringify([temp]);
    this.uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
    this.downloadJsonHref = this.uri;

  }

  /*onFileChanged(event) {

    const allowed_types = ['script/json'];
    if (!_.includes(allowed_types, event.target.files[0].type)) {
      this.jsonerror = 'Only JSON scripts are allowed ( JSON )';
      alert(this.jsonerror);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.selectedFile =  event.target.files[0].name;
  }*/

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
      localStorage.setItem("sent_workshop", JSON.stringify(this.products[0]));
      location.reload();
    });


  }








}
