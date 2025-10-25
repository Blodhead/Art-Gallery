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

  constructor(private service: UserService, private _router: Router) { }

  username: string;
  password: string;
  confirm_password: string;
  email: string;
  Error_message: string;
  isLoading: boolean = false;
  errorMessage: string = '';

  boot: boolean = false;

  temp_usernames: Array<string> = [];
  temp_mails: Array<string> = [];


  current_user: string = null;

  ngOnInit(): void {
    this.getTempData();

    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    if (this.current_user != null) {
      localStorage.removeItem("current_user");
      this._router.navigate([""]);
    }
  }

  unlock() {
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
          this.temp_mails[i] = temp_data[i].email;
        }

      }
    });
  }

  imageError: string;
  cardImageBase64: string;
  isImageSaved: boolean;

  //#region validations rgb(255, 235, 235)

  isLetter(): boolean {
    if (this.boot == false) return true;
    let arr = this.password;

    if (this.containsSpecialChars(arr.charAt(0)) == true) return false;
    if (Number.isNaN(Number(arr.charAt(0))))
      return true;
    else return false;
  }

  containsSpecialChars(str): boolean {
    if (this.boot == false) return true;
    let arr = str;
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(arr);
  }

  hasANumber(): boolean {
    if (this.boot == false) return true;
    let arr = this.password;

    for (let i = 0; i < this.password.length; i++) {
      if (!Number.isNaN(Number(arr.charAt(i))))
        if (Number(arr.charAt(i)) >= 0 || Number(arr.charAt(i)) <= 9) {
          return true;
        }
    }
    return false;
  }

  hasACapital(): boolean {
    if (this.boot == false) return true;
    let character: String;
    for (let i = 0; i < this.password.length; i++) {

      character = this.password.charAt(i);
      if (this.containsSpecialChars(character) == true) continue;

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
    if (this.boot == false) return true;
    if (this.password.length < 8 || this.password.length > 16)
      return false;
    return true;
  }


  isSameAsPassword(): boolean {
    if (this.password == this.confirm_password) return true;
    return false;
  }

  //#endregion 

  register() {

    // Validate inputs
    this.Error_message = "";
    if (!this.username) this.Error_message += "Missing Username\n";
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
    this.isLoading = true;
    this.errorMessage = '';
    this.service.checkMail(this.email).subscribe((resp: any) => {
      if (resp && resp.exists) {
        this.isLoading = false;
        this.errorMessage = 'E-mail already registered';
        return;
      }
      this.service.register(this.username, this.password, this.email).subscribe((res: any) => {
          this.isLoading = false;
          if (res && res["message"] == "user added") {
            // Auto-login: call login endpoint to obtain token & user object
            this.userLoginAfterRegister(this.username, this.password);
          } else {
            this.errorMessage = 'Registration error';
          }
        }, err => {
          console.error(err);
          this.isLoading = false;
          this.errorMessage = 'Registration error';
        });

    }, err => {
      console.error(err);
      this.isLoading = false;
      this.errorMessage = 'Error checking email';
    });

  }

  userLoginAfterRegister(username: string, password: string) {
    this.userLogin(username, password);
  }

  userLogin(username: string, password: string) {
    this.service.login(username, password).subscribe((user: any) => {
      if (user) {
        localStorage.setItem('current_user', JSON.stringify(user.username));
        localStorage.setItem('email', JSON.stringify(user.email));
        localStorage.setItem('token', JSON.stringify(user.token));
        window.location.href = '/';
      } else {
        this.errorMessage = 'Login failed after registration';
      }
    }, err => {
      console.error(err);
      this.errorMessage = 'Login failed after registration';
    });
  }
}
