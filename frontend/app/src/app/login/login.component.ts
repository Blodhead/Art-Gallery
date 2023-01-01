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

  constructor(private userService: UserService, private router: Router) { }

  current_path: String;

  ngOnInit(): void {
    this.current_path = this.router.url.split('/').pop();
    //localStorage.removeItem("current_user");//temporary
  }

  username: string;
  password: string;
  //message:string;

  login() {
    this.userService.login(this.username, this.password).subscribe((user: User) => { //subscribe je cekanje odgovora, tj. nna return pozvane funkcije
      if (user) {
        if (user.status == "waiting") { alert("Your account is yet to be approved"); return; }
        localStorage.setItem("current_user", JSON.stringify(user));
        if (user.type == "admin" && this.current_path == "admin") {
          this.router.navigate(["/admin"]);
        } else if(user.type != "admin") this.router.navigate(["/user"]);
        else
        alert("User does not exist");
      }
      else alert("Password and username don't match");
      //this.message="bad data"
    });
  }

}
