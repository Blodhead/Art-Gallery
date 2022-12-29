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

active_tab:string = "Organizers";
allUsers: User[] = [];
organisers: User[] = [];
participants: User[] = [];
requests: User[] = [];

  ngOnInit(): void {
    this.service.getTempData().subscribe((data: User[])=>{
      
      for(var i = 0; i < data.length ; i++){

        if(data[i].type != "admin")
        this.allUsers.push(data[i]);
        
        if(data[i].status == "waiting")
          this.requests.push(data[i]);
          else if(data[i].type == "participant") this.participants.push(data[i]);
          else if(data[i].type == "organizer") this.organisers.push(data[i]);

      }
    })
  }

  accept(username, password){
    
    var user:User;

    for(var i = 0; i < this.allUsers.length; i++){
      if(this.allUsers[i].username == username){
        user = this.allUsers[i];
        break;
      }
    }

    user.status = "approved";

    if(!user) alert("Something is wery wrong");

    this.service.updateStatus(user).subscribe();
    location.reload();
  }

  reject(username, password){
    var user:User;

    for(var i = 0; i < this.allUsers.length; i++){
      if(this.allUsers[i].username == username){
        user = this.allUsers[i];
        break;
      }
    }

    user.status = "rejected";

    if(!user) alert("Something is wery wrong");

    this.service.updateStatus(user).subscribe();
    location.reload();
  }

  getTab():string{
    return this.active_tab;
  }

  setTab(input){
    this.active_tab = input;
  }
}
