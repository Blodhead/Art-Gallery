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

  /*onFileSelected(event) {
    const allowed_types = ['image/png', 'image/jpeg'];
    const max_height = 300;
    const max_width = 300;
    const min_height = 100;
    const min_width = 100;

    if (!_.includes(allowed_types, event.target.files[0].type)) {
      this.imageError = 'Only Images are allowed ( JPG | PNG )';
      this.profile_photo_name = "../../assets/images/users/avatar2.png";
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
          this.profile_photo_name = "../../assets/images/users/avatar2.png";
          alert(this.imageError);
          return;
        } else if (img_height < min_height && img_width < min_width) {
          this.imageError =
            'Minimum dimentions allowed ' +
            min_height +
            '*' +
            min_width +
            'px';
          this.profile_photo_name = "../../assets/images/users/avatar2.png";
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
    this.profile_photo_name = "../../assets/images/users/" + event.target.files[0].name;
  }*/

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

  
  isSameAsPassword(): boolean {
    if(this.password == this.confirm_password) return true;
    return false;
  }

  Error_message: string;

  register() {

    // Validate inputs
    this.Error_message = "";
    if (!this.username) this.Error_message += "Missing Username\n";
    if (!this.mail) this.Error_message += "Missing Email\n";
    if (!this.password) this.Error_message += "Missing Password\n";
    if (this.password && (!this.hasLength() || !this.hasACapital() || !this.hasANumber() || !this.containsSpecialChars(this.password) || !this.isLetter())) this.Error_message += "Invalid password\n";
    if (this.password !== this.confirm_password) this.Error_message += "Passwords must match\n";

    // username duplication check from temp data
    for (var i = 0; i < this.temp_usernames.length; i++) {
      if (this.temp_usernames[i] == this.username) {
        this.Error_message += "Username is taken\n";
        break;
      }
    }

    if (this.Error_message.length > 0) {
      alert('Input error:\n' + this.Error_message);
      return;
    }

    // Check email uniqueness on server
    this.service.checkMail(this.mail).subscribe((resp: any) => {
      if (resp && resp.exists) {
        alert('E-mail already registered');
        return;
      }

      // proceed to register (backend hashes password)
      const defaults = {
        profile_photo_name: this.profile_photo_name || "../../assets/images/users/avatar2.jpg",
        firstname: this.firstname || "",
        lastname: this.lastname || "",
        mail: this.mail || "",
        phone: this.phone || "",
        type: this.type || "participant",
        org_name: this.org_name || "",
        state: this.state || "",
        city: this.city || "",
        postal_code: this.postal_code || "",
        street: this.street || "",
        number: this.number || 0,
        pib: this.pib || "",
        status: this.status || "waiting"
      };

      this.service.register(defaults.profile_photo_name, defaults.firstname, defaults.lastname, this.username, this.password, defaults.mail, defaults.phone, defaults.type,
        defaults.org_name, defaults.state, defaults.city, defaults.postal_code, defaults.street, defaults.number, defaults.pib, defaults.status).subscribe((res) => {
          if (res && res["message"] == "user added") {
            alert("Register acknowledged");
            this._router.navigate(["/login"]);
          } else {
            alert("ERROR");
          }
        }, err => {
          console.error(err);
          alert("ERROR");
        });

    }, err => {
      console.error(err);
      alert('Error checking email');
    });

  }

}
