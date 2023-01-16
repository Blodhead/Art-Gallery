import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../models/workshop-details';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() myMessage: Comment;

  username: string ="";
  image: string ="";
  message: string ="";
  date: Date = null;
  align: string ="";

  ngOnInit(): void {
    this.username = this.myMessage.username;
    this.image = this.myMessage.image;
    this.message = this.myMessage.message;
    this.date = this.myMessage.date;
  }
}
