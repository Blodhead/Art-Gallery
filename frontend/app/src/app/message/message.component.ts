import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Comment } from '../models/workshop-details';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() myMessage: Comment;

  username: string = "";
  image: string = "";
  message: string = "";
  date: Date = null;
  align: string = "";
  current_user: User = null;

  ngOnInit(): void {
    this.username = this.myMessage.username;
    this.image = this.myMessage.image;
    this.message = this.myMessage.message;
    this.date = this.myMessage.date;

    this.current_user = JSON.parse(localStorage.getItem("current_user"));
    
  }
}
