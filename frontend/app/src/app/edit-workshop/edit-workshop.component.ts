import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { WorkshopDetails } from '../models/workshop-details';
import { WorkshopService } from '../workshop.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-edit-workshop',
  templateUrl: './edit-workshop.component.html',
  styleUrls: ['./edit-workshop.component.css']
})
export class EditWorkshopComponent implements OnInit {

  constructor(private service: WorkshopService, private _router: Router) { }

  current_user: string;
  sent_workshop: WorkshopDetails;
  Error_message: string;

  imageError:string;
  cardImageBase64: string;
  isImageSaved: boolean;

  name:string;
  choosen_Date: Date;
  date:Date;
  image:string;
  location:string;
  description:string;

  likes:string[] = [];

  ngOnInit(): void {
    this.current_user = localStorage.getItem("current_user");
    this.sent_workshop = JSON.parse(localStorage.getItem("sent_workshop"));

    if(this.sent_workshop != null){
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
    localStorage.removeItem("sent_user");

    if (this.current_user == "admin") {
      this._router.navigate(["admin"]);
    }
    else if (this.current_user == "organizer") {
      this._router.navigate(["user"]);
    }
    else if (this.current_user == "participant") {
      this._router.navigate(["user"]);
    }

  }
  mydate:string;

  save() {
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
    if (this.description == null) {
      this.Error_message += "Workshop description missing\n"
    }

    if (this.Error_message != "Input error:\n") {
      alert(this.Error_message);
      return;
    }

    this.mydate = (this.date.getMonth()+1)+" "+this.date.getDate()+" "+ this.date.getFullYear();

    if(this.sent_workshop == null)
    this.service.save(this.name, this.image, this.description, this.date, this.location, this.likes).subscribe((workshop) => {
      if (workshop != null) {
        alert("Register acknowledged");
        this.cancel();
      }
      else alert("ERROR");
    });
    else if(this.sent_workshop != null){
      this.service.update(this.sent_workshop.name,this.name, this.image, this.description, this.date, this.location, this.likes).subscribe((workshop) => {
        if (workshop != null) {
          alert("Register acknowledged");
          this.cancel();
        }
        else alert("ERROR");
      });
    }


  }
}
