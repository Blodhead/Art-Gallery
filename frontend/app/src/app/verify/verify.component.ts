import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { SharedService } from '../shared.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(private service: UserService, private _router: Router, private sharedService: SharedService) { }

  old_password: string = "";
  new_password: string = "";
  confirm_password: string = "";
  current_user: User = null;
  reload: string = "";
  boot: boolean = false;
  Error_message: string;
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    if (this.current_user == null) this._router.navigate(["login"]);
    this.reload = localStorage.getItem("reload");
    if (this.reload == "true") {
      localStorage.removeItem("reload");
      this.sharedService.sendclickEvent();
    }
  }



  isLetter(): boolean {
    if (this.boot == false) return true;
    let arr = this.new_password;

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
    let arr = this.new_password;

    for (let i = 0; i < this.new_password.length; i++) {
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
    for (let i = 0; i < this.new_password.length; i++) {

      character = this.new_password.charAt(i);
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
    if (this.new_password.length < 8 || this.new_password.length > 16)
      return false;
    return true;
  }


  isSameAsPassword(): boolean {
    if (this.new_password == this.confirm_password) return true;
    return false;
  }

  unlock() {
    this.boot = true;
  }

  cancel() {

    if (this.current_user.type == "admin") {
      this._router.navigate(["admin"]);
    }
    else if (this.current_user.type == "participant") {
      this._router.navigate(["/user"]);
    }
    else if (this.current_user.type == "organizer") {
      this._router.navigate(["/user_organizer"]);
    }

  }

  save() {

    if (this.old_password == null || this.new_password == null || this.confirm_password == null) {
      alert("All fields must be filled");
      return;
    }

    // Do not compare with local copy of password (may be hashed). Send old and new passwords to backend
    // backend will validate old password (or tempPass) and perform hashing.

    if (this.new_password != this.confirm_password) {
      alert("New and confirmation password do not match!");
      return;
    }

    if (!this.hasLength() || !this.hasACapital() || !this.hasANumber() || !this.containsSpecialChars(this.new_password) || !this.isLetter()) {
      alert("New password not valid!");
      return;
    }

    this.isLoading = true;
    this.service.changePassword(this.current_user, this.old_password, this.new_password).subscribe({
      next: (resp: any) => {
        alert("Change password successful");
        localStorage.removeItem("current_user");
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        window.location.href = '/';
      },
      error: (err) => {
        this.isLoading = false;
        if (err && err.error && err.error.message) alert(err.error.message);
        else alert('Error changing password');
      }
    });
  }

}
