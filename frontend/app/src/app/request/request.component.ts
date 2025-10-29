import { Component, Input } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../user.service';
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent {

  constructor(private service: UserService) { }

  @Input() myUser: User;
  
  @Input() myallUsers:User[];

  accept(username, type) {

    localStorage.setItem("type", type);

    var user: User;

    for (var i = 0; i < this.myallUsers.length; i++) {
      if (this.myallUsers[i].username == username) {
        user = this.myallUsers[i];
        break;
      }
    }

    user.status = "approved";

    if (!user) alert("Something is wery wrong");

    this.service.updateStatus(user).subscribe();
    location.reload();
  }

  reject(username, type) {
    var user: User;
    localStorage.setItem("type", type);
    for (var i = 0; i < this.myallUsers.length; i++) {
      if (this.myallUsers[i].username == username) {
        user = this.myallUsers[i];
        break;
      }
    }


    user.status = "rejected";

    if (!user) alert("Something is wery wrong");

    this.service.updateStatus(user).subscribe();
    location.reload();
  }
}
