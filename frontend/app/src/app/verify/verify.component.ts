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

  old_pass: string = "";
  new_pass: string = "";
  confirm_pass: string = "";
  current_user: User = null;
  reload: string = "";
  boot: boolean = false;

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
    let arr = this.new_pass;

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
    let arr = this.new_pass;

    for (let i = 0; i < this.new_pass.length; i++) {
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
    for (let i = 0; i < this.new_pass.length; i++) {

      character = this.new_pass.charAt(i);
      if (this.containsSpecialChars(character) == false) {

        if (!isNaN(Number(character) * 1)) {

        } else {
          if (character == character.toUpperCase()) {
            return true;
          }
        }
      }
    }
    return false;
  }

  hasLength(): boolean {
    if (this.boot == false) return true;
    if (this.new_pass.length < 8 || this.new_pass.length > 16)
      return false;
    return true;
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

    if (this.old_pass == null || this.new_pass == null || this.confirm_pass == null) {
      alert("All fields must be filled");
      return;
    }

    if (this.old_pass != this.current_user.password && this.current_user.tempPass != this.old_pass) {
      alert("Old password does not match!");
      return;
    }

    if (this.new_pass != this.confirm_pass) {
      alert("New and confirmation password do not match!");
      return;
    }

    if (!this.hasLength() || !this.hasACapital() || !this.hasANumber() || !this.containsSpecialChars(this.new_pass) || !this.isLetter()) {
      alert("New password not valid!");
      return;
    }

    this.service.updatePassword(this.current_user.username, this.new_pass).subscribe((statement) => {
      localStorage.setItem("reload", "true");
      alert("Change password successful");
      localStorage.removeItem("current_user");
      this._router.navigate(["login"]);
    });
  }

}
