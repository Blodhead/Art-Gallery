import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent {
  constructor(private service: UserService, private _router:Router) {}

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

  edit(user){
    localStorage.setItem("sent_user",(JSON.stringify(user)));
    this._router.navigate(["admin/edit_user"]);
  }
}
