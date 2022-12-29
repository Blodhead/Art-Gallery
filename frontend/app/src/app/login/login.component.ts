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

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  username: string;
  password: string;
  //message:string;
  
  login() {
    this.userService.login(this.username, this.password).subscribe((user: User) => { //subscribe je cekanje odgovora, tj. nna return pozvane funkcije
      if (user) {
        if(user.status == "waiting") {alert("Your account is yet to be approved"); return;}
        if(user.type == "admin"){
          this.router.navigate(["/admin"]);
        }else this.router.navigate(["/user"]);
      }
      else alert("Password and username don't match");
      //this.message="bad data"
    });
  }

}
