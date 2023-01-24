import { Component, Input, OnInit } from '@angular/core';
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
    if (this.myWorkshop == null) {
      this.myWorkshop = this.unique_workshop;
    }

    for (let k = 0; k < this.myWorkshop.messages.length; k++)
      this.myWorkshop.messages[k].date = new Date(this.myWorkshop.messages[k].date);

    let temp_array: Array<Message[]> = [];
    let real_arr: Message[][] = [];


    this.users_service.getTempData().subscribe((users_list: User[]) => {
      this.current_path = this._router.url.split('/').pop();
      if (this.current_path == "user") {

        let arr = document.getElementsByClassName("poruka");
        for (let i = 0; i < arr.length; i++) {
          const slide = arr[i] as HTMLElement;
          slide.style.width = "auto";
          slide.style.height = "auto";
          slide.style.paddingBottom = "20px";
        }
      }


      let temp_usernames: string[] = [];
      for (let k = 0; k < users_list.length; k++) {
        temp_usernames.push(users_list[k].username);
        this.temp_images.push(users_list[k].profile_photo_name);
      }
      temp_array.push(this.myWorkshop.messages);


      for (var s: number = 0; s < temp_usernames.length; s++) {
        real_arr[s] = [];
        this.name_index[s] = null;
      }

      for (let i = 0; i < temp_array[0].length; i++) {
        for (let j = 0; j < temp_usernames.length; j++) {
          if (this.user1.type == "organizer") {
            if (this.user1.username != temp_usernames[j])
              if (temp_array[0][i].from == temp_usernames[j] || temp_array[0][i].to == temp_usernames[j]) {
                real_arr[j].push(temp_array[0][i]);
                this.name_index[j] = temp_usernames[j];

              }
          } else if (this.user1.type == "participant") {
            if (this.user1.username == temp_usernames[j])
              if (temp_array[0][i].from == temp_usernames[j] || temp_array[0][i].to == temp_usernames[j]) {
                real_arr[j].push(temp_array[0][i]);
                this.name_index[j] = temp_usernames[j];

              }
          }

        }
      }

      for (let i = 0; i < real_arr.length; i++)
        if (real_arr[i].length == 0) real_arr[i] = null;

      real_arr = real_arr.filter(elements => {
        return (elements != null && elements !== undefined);
      });

      this.name_index = this.name_index.filter(elements => {
        return (elements != null && elements !== undefined);
      });

      /*for (var s: number = 0; s < real_arr.length; s++) {
        this.messages[s] = [];
      }*/

      for (let i = 0; i < real_arr.length; i++) {
        this.messages.push(real_arr[i]);
      }

      this.show();

      //conversion from message to comment
      for (let i = 0; i < this.messages.length; i++) {
        let comm: Comment[] = [];
        for (let j = 0; j < this.messages[i].length; j++) {

          let why = 0;

          for (let x = 0; x < temp_usernames.length; x++) {
            if (this.messages[i][j].from == temp_usernames[x]) {
              why = x;
              break;
            }
          }

          let data = {
            username: this.messages[i][j].from,
            image: this.temp_images[why],
            date: this.messages[i][j].date,
            message: this.messages[i][j].message
          }

          comm.push(new Comment(data));


        }
        this.comments.push(comm);
      }

    });

  }

  myWorkshop: WorkshopDetails = null;
  user1: User = null;
  user2: User = null;
  current_path: string = "";
  @Input() unique_workshop: WorkshopDetails;

  messages: Message[][] = [];
  comments: Comment[][] = [];
  msg: string[] = [];
  index: number[] = [];
  name_index: string[] = [];
  temp_images: string[] = [];

  open(id) {
    if (this.current_path == 'user') return;
    var x = document.getElementById(id);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }

  }

  comment(index) {

    let data1 = {
      username: this.user1.username,
      image: this.user1.profile_photo_name,
      date: new Date(),
      message: this.msg[index]
    }

    this.comments[index].push(new Comment(data1));

    if (this.user1.type == "organizer") {

      let data2 = {
        from: this.user1.username,
        to: this.name_index[index],
        message: this.msg[index],
        date: new Date()
      }

      this.messages[index].push(new Message(data2));
    } else {

      let data2 = {
        from: this.name_index[index],
        to: this.user1.username,
        message: this.msg[index],
        date: new Date()
      }

      this.messages[index].push(new Message(data2));

    }

    this.workshop_service.addMessage(this.myWorkshop.name, this.messages[index][this.messages[index].length - 1]).subscribe((statement) => {
      this.myWorkshop.messages.push(this.messages[index][this.messages[index].length - 1]);
      localStorage.setItem("sent_workshop", JSON.stringify(this.myWorkshop));
    });

  }

  cancel(index) {
    this.msg[index] = "";
  }

  show() {

    if (this.user1.type == "participant") {
      for (let i = 0; i < this.name_index.length; i++) {
        if (this.name_index[i] != this.user1.username) {
          this.name_index[i] = null;
          this.messages[i] = null;
        }

      }
      this.name_index = this.name_index.filter(elements => {
        return (elements != null && elements !== undefined);
      });

      this.messages = this.messages.filter(elements => {
        return (elements != null && elements !== undefined);
      });

      if (this.messages.length == 0) {
        this.name_index.push(this.user1.username);
        let temp: Message[] = [];

        let data = {
          date: new Date(),
          from: this.myWorkshop.owner,
          to: this.user1.username,
          message: "Hi, how may I assist you today?"
        }

        temp.push(data);
        this.messages = [];
        this.messages.push(temp);
      }

    }
  }

}
