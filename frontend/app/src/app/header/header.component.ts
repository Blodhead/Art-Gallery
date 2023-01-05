import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  constructor( private _router: Router){}

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
  }
  current_user:User = null;


  logout(){
    localStorage.setItem("reload", "true");
    localStorage.removeItem("current_user");
    this._router.navigate([""]);
  }
}
