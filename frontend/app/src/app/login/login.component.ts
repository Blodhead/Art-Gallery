import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from "../models/user"
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService, private _router: Router) { }

  current_path: String;

  ngOnInit(): void {
    this.current_path = this._router.url.split('/').pop();
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    if (this.current_user != null) {
      localStorage.removeItem("current_user");
      this._router.navigate([""]);
    }
    //localStorage.removeItem("current_user");//temporary

  }
  current_user: User;
  username: string;
  password: string;
  //message:string;

  login() {
    this.userService.login(this.username, this.password).subscribe((user: User) => { //subscribe je cekanje odgovora, tj. nna return pozvane funkcije
      if (user) {
        localStorage.setItem("reload", "true");
        if (user.status == "waiting") { alert("Your account is yet to be approved"); return; }
        localStorage.setItem("current_user", JSON.stringify(user));
        if (user.type == "admin" && this.current_path == "admin") {
          this._router.navigate(["/admin"]);
        } else if (user.type == "organizer" && this.current_path != "admin") this._router.navigate(["/user_organizer"]);
        else if (user.type == "participant" && this.current_path != "admin") this._router.navigate(["/user"]);
        else
          alert("User does not exist");
      }
      else alert("Password and username don't match");
      //this.message="bad data"
    });
  }
  show: boolean = false;
  recovery: string;
  change() {
    this.show = !this.show;
  }
  reload() {
    if (this.recovery != null)
      if (this.recovery.indexOf("@")!==-1 && this.recovery.indexOf(".com")!==-1) {
        //
        alert("Email sent!")
        this.rr();
        return;
      }
    alert("Invalid email!");
  }

  rr(){
    location.reload();
  }
}
