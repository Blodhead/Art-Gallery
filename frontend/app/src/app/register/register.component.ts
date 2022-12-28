import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private service: UserService) { }

  profile_photo = null;
  profile_photo_name: string;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  type: string;

  confirm_password: string;


  //OPTIONAL DATA FOR ORGANIZOR

  state: string;
  city: string;
  postal_code: string;
  street: string;
  number: number;
  pib: string;

  getType(): boolean {
    if (this.type == "organizer") return true;
    else return false;
  }

  org_name: string;

  ngOnInit(): void {
    this.profile_photo_name = "../../assets/images/img_avatar2.png";
  }

  onFileSelected(event) {
    this.profile_photo = event.target.files[0];
    this.profile_photo_name = "../../assets/images/" + event.target.files[0].name;
  }

  register() {

    if (this.password != this.confirm_password) { alert("Passwords must match!"); return; }

    this.service.register(this.profile_photo_name, this.firstname, this.lastname, this.username, this.password, this.type,
      this.org_name, this.state, this.city, this.postal_code, this.street, this.number, this.pib).subscribe((res) => {
        if (res["message"] == "user added") alert("OK");
        else alert("ERROR");
      });
  }
}
