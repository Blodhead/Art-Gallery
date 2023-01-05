import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import * as _ from 'lodash';
import { User, Temp_Data } from "../models/user"
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})



export class RegisterComponent implements OnInit {

  constructor(private service: UserService,private _router: Router) { }

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
  pib: string = "Enter pib";
  phone: string;
  mail: string;
  status: string = "waiting";
  org_name: string;

  boot:boolean = false;

  temp_usernames: Array<string> = [];
  temp_mails: Array<string> = [];


  current_user:User;
  getType(): boolean {
    if (this.type == "organizer") return true;
    else return false;
  }

  ngOnInit(): void {
    this.profile_photo_name = "../../assets/images/img_avatar2.png";
    this.getTempData();

    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    if(this.current_user != null){
      localStorage.removeItem("current_user");
      this._router.navigate([""]);
    }
  }

  unlock(){
    this.boot = true;
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

  isLetter(): boolean {
    if(this.boot==false) return true;
    let arr = this.password;

    if(this.containsSpecialChars(arr.charAt(0)) == true) return false;
    if (Number.isNaN(Number(arr.charAt(0))))
    return true;
    else return false;
  }

  containsSpecialChars(str): boolean {
    if(this.boot==false) return true;
    let arr = str;
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(arr);
  }

  hasANumber(): boolean {
    if(this.boot==false) return true;
    let arr = this.password;

    for (let i = 0; i < this.password.length; i++) {
      if(!Number.isNaN(Number(arr.charAt(i))))
      if (Number(arr.charAt(i)) >= 0 || Number(arr.charAt(i)) <= 9) {
        return true;
      }
    }
    return false;
  }

  hasACapital(): boolean {
    if(this.boot==false) return true;
    let character: String;
    for (let i = 0; i < this.password.length; i++) {

      character = this.password.charAt(i);
      if(this.containsSpecialChars(character) == true) continue;

      if (!isNaN(Number(character) * 1)) {

      } else {
        if (character == character.toUpperCase()) {
          return true;
        }
        if (character == character.toLowerCase()) {

        }
      }

    }
    return false;
  }

  hasLength(): boolean {
    if(this.boot==false) return true;
    if (this.password.length < 8 || this.password.length > 16)
      return false;
    return true;
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
    } else if (!this.hasLength() || !this.hasACapital() || !this.hasANumber() || !this.containsSpecialChars(this.password) || !this.isLetter())
      this.Error_message += "Invalid password";

    if (this.password != this.confirm_password) { this.Error_message += "Passwords must match!\n" }

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
      this.org_name, this.state, this.city, this.postal_code, this.street, this.number, this.pib, this.status).subscribe((res) => {
        if (res["message"] == "user added") {

          alert("Register acknowledged");
          this._router.navigate([""]);
        }
        else alert("ERROR");
      });


  }

}
