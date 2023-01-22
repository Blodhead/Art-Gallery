import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Comment, Message, WorkshopDetails } from '../models/workshop-details';
import { UserService } from '../user.service';
import { WorkshopService } from '../workshop.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private _router: Router, private workshop_service: WorkshopService, private users_service: UserService) { }

  ngOnInit(): void {
    this.myWorkshop = JSON.parse(localStorage.getItem("sent_workshop"));
    this.user1 = JSON.parse(localStorage.getItem("current_user"));
    if (this.user1 == null) this._router.navigate(["login"]);
    if (this.myWorkshop == null) this._router.navigate([""]);

    for (let k = 0; k < this.myWorkshop.messages.length; k++)
      this.myWorkshop.messages[k].date = new Date(this.myWorkshop.messages[k].date);

    let temp_array: Array<Message[]> = [];
    let real_arr: Message[][] = [];

    this.users_service.getTempData().subscribe((users_list: User[]) => {

      let temp_usernames: string[] = [];

      for (let k = 0; k < users_list.length; k++) {
        temp_usernames.push(users_list[k].username);
      }
      temp_array.push(this.myWorkshop.messages);


      for (var s: number = 0; s < temp_usernames.length; s++) {
        real_arr[s] = [];
      }

      for (let i = 0; i < temp_array[0].length; i++) {
        for (let j = 0; j < temp_usernames.length; j++) {
          if (this.user1.username != temp_usernames[j])
            if (temp_array[0][i].from == temp_usernames[j] || temp_array[0][i].to == temp_usernames[j])
              real_arr[j].push(temp_array[0][i]);
        }
      }

      for (let i = 0; i < real_arr.length; i++)
        if (real_arr[i].length == 0) real_arr[i] = null;

      real_arr = real_arr.filter(elements => {
        return (elements != null && elements !== undefined);
      });

      for (var s: number = 0; s < real_arr.length; s++) {
        this.messages[s] = [];
      }

      for (let i = 0; i < real_arr.length; i++) {
        this.messages[i].push(real_arr[i]);
      }

      //conversion from message to comment

    });
  }

  myWorkshop: WorkshopDetails = null;;
  user1: User = null;
  user2: User = null;


  messages: Message[][][] = [];
  comments: Comment[] = [];
  msg: string = "";
  index: number[] = [];

  open(id) {
    var x = document.getElementById(id);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }

  }

  comment() {

  }

  cancel() {

  }

}
