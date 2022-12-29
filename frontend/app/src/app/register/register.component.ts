import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import * as _ from 'lodash';
import { User, Temp_Data } from "../models/user"

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})



export class RegisterComponent implements OnInit {

  constructor(private service: UserService) { }

  profile_photo = null;
  profile_photo_name: string;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  type: string;
  confirm_password: string;
  state: string;
  city: string;
  postal_code: string;
  street: string;
  number: number;
  pib: string;
  phone:string;
  mail:string;


  temp_usernames: Array<string> = [];
  temp_mails: Array<string> = [];

  getType(): boolean {
    if (this.type == "organizer") return true;
    else return false;
  }

  org_name: string;

  ngOnInit(): void {
    this.profile_photo_name = "../../assets/images/img_avatar2.png";
    this.getTempData();
  }

  getTempData() {
    this.service.getTempData().subscribe((temp_data: Temp_Data[]) => { //subscribe je cekanje odgovora, tj. nna return pozvane funkcije
       if (!temp_data) {
        alert("Error get All data");
      }
      else {
        for (var i = 0; i < temp_data.length; i++) {
          this.temp_usernames[i] = temp_data[i].username;
          this.temp_mails[i] = temp_data[i].mail;
        }

      }
    });
  }

  imageError: string;
  cardImageBase64: string;
  isImageSaved: boolean;

  onFileSelected(event) {
    const allowed_types = ['image/png', 'image/jpeg'];
    const max_height = 300;
    const max_width = 300;
    const min_height = 100;
    const min_width = 100;

    if (!_.includes(allowed_types, event.target.files[0].type)) {
      this.imageError = 'Only Images are allowed ( JPG | PNG )';
      this.profile_photo_name = "../../assets/images/img_avatar2.png";
      alert(this.imageError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = rs => {
        const img_height = rs.currentTarget['height'];
        const img_width = rs.currentTarget['width'];

        console.log(img_height, img_width);


        if (img_height > max_height && img_width > max_width) {
          this.imageError =
            'Maximum dimentions allowed ' +
            max_height +
            '*' +
            max_width +
            'px';
          this.profile_photo_name = "../../assets/images/img_avatar2.png";
          alert(this.imageError);
          return;
        } else if (img_height < min_height && img_width < min_width) {
          this.imageError =
            'Minimum dimentions allowed ' +
            min_height +
            '*' +
            min_width +
            'px';
          this.profile_photo_name = "../../assets/images/img_avatar2.png";
          alert(this.imageError);
          return;
        } else {
          const imgBase64Path = e.target.result;
          this.cardImageBase64 = imgBase64Path;
          this.isImageSaved = true;
          // this.previewImagePath = imgBase64Path;
        }
      };
    };
    reader.readAsDataURL(event.target.files[0]);

    this.profile_photo = event.target.files[0];
    this.profile_photo_name = "../../assets/images/" + event.target.files[0].name;
  }

  removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }

  Error_message: string;

  register() {
    this.Error_message = "Input error:\n";

    if (this.firstname == null) {
      this.Error_message += "Missing Firstname\n"
    }

    if (this.lastname == null) {
      this.Error_message += "Missing Lastname\n"
    }

    if (this.password == null) {
      this.Error_message += "Missing Password\n"
    } else if (this.password != this.confirm_password) { this.Error_message += "Passwords must match!\n" }

    if (this.type == null) {
      this.Error_message += "Must choose type\n"
    }

    if (this.phone == null) {
      this.Error_message += "Missing phone number\n"
    }

    if (this.username == null) {
      this.Error_message += "Missing Username\n"
    } else {
      for (var i = 0; i < this.temp_usernames.length; i++) {
        if (this.temp_usernames[i] == this.username) {
          this.Error_message += "Username is taken\n";
          break;
        }
      }
    }

    if (this.mail == null) {
      this.Error_message += "Missing Mail\n"
    } else {
      for (var i = 0; i < this.temp_mails.length; i++) {
        if (this.temp_mails[i] == this.mail) {
          this.Error_message += "E-mail is taken\n";
          break;
        }
      }
    }

    if (this.Error_message != "Input error:\n") {
      alert(this.Error_message);
      return;
    }

    this.service.register(this.profile_photo_name, this.firstname, this.lastname, this.username, this.password, this.mail, this.phone, this.type,
      this.org_name, this.state, this.city, this.postal_code, this.street, this.number, this.pib).subscribe((res) => {
        if (res["message"] == "user added") alert("OK");
        else alert("ERROR");
      });


  }

}
