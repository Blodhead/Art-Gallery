import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import * as _ from 'lodash';
import { User, Temp_Data } from "../models/user"
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  constructor(private service: UserService, private _router: Router) { }

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
  current_user: User;
  org_name: string;

  imageError: string;
  cardImageBase64: string;
  isImageSaved: boolean;

  sent_user: User;
  temp_usernames: Array<string> = [];
  temp_mails: Array<string> = [];

  ngOnInit() {
    this.profile_photo_name = "../../assets/images/img_avatar2.png";
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    this.sent_user = JSON.parse(localStorage.getItem("sent_user"));

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

    if (this.sent_user != null) {

      this.username = this.sent_user.username;
      this.firstname = this.sent_user.firstname
      this.lastname = this.sent_user.lastname;
      this.profile_photo_name = this.sent_user.profile_photo_name;
      this.password = this.sent_user.password;
      this.type = this.sent_user.type;
      this.state = this.sent_user.state;
      this.city = this.sent_user.city;
      this.postal_code = this.sent_user.postal_code;
      this.street = this.sent_user.street;
      this.number = this.sent_user.number;
      this.pib = this.sent_user.pib;
      this.phone = this.sent_user.phone;
      this.mail = this.sent_user.mail;
      this.status = this.sent_user.status;
      this.org_name = this.sent_user.org_name.toString();

    }
  }

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


  getType(): boolean {
    if (this.type == "organizer") return true;
    else return false;
  }

  cancel() {
    localStorage.removeItem("sent_user");

    if (this.current_user.type == "admin") {
      this._router.navigate(["admin"]);
    }
    else if (this.current_user.type == "organizer") {
      this._router.navigate(["user"]);
    }
    else if (this.current_user.type == "participant") {
      this._router.navigate(["user"]);
    }

  }

  Error_message: String;

  save() {

    if (this.sent_user == null) {
      this.Error_message = "Input error:\n";

      if (this.firstname == null) {
        this.Error_message += "Missing Firstname\n"
      }

      if (this.lastname == null) {
        this.Error_message += "Missing Lastname\n"
      }

      if (this.password == null) {
        this.Error_message += "Missing Password\n"
      }

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

    }

    if (this.sent_user != null)
      this.service.deleteUser(this.sent_user).subscribe((user) => {
        user = null;
      });

    this.service.register(this.profile_photo_name, this.firstname, this.lastname, this.username, this.password, this.mail, this.phone, this.type,
      this.org_name, this.state, this.city, this.postal_code, this.street, this.number, this.pib, this.status).subscribe((res) => {
        if (res["message"] == "user added") {
          if (this.sent_user != null)
            alert("Data successfully modified");
          else {
            alert("New user added");
          }
          this.cancel();
        }
        else {
          alert("ERROR");
          this.cancel();
        }

      });

  }

}
