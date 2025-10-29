import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {
  constructor(private service: UserService, private _router: Router) { }

  current_user: User = null;

  ngOnInit(): void {
    this.current_user = JSON.parse(localStorage.getItem("current_user"));
  }

  @Input() myUser: User;


  delete(username, type) {
    let user = new User();
    localStorage.setItem("type", type);
    user.username = username.toString();
    this.service.deleteUser(user).subscribe((user) => {
      user = null;
      location.reload();
    });
  }

  edit(user) {
    localStorage.setItem("sent_user", (JSON.stringify(user)));
    this._router.navigate(["admin/edit_user"]);
  }
}
