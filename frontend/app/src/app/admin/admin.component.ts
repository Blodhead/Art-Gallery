import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {


  constructor(private service: UserService){}

active_tab:boolean = true;

  ngOnInit(): void {
    this.service.getTempData().subscribe((data: User[])=>{
      
      for(var i = 0; i < data.length ; i++){
        if(data[i].type != "admin")
        this.allUsers.push(data[i]);
      }
    })
  }

  allUsers: User[] = []

  getTab():boolean{
    return this.active_tab;
  }

  setTab(input){
    this.active_tab = input;
  }
}
