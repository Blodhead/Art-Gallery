import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

constructor(private service:UserService){}

profile_photo = null;
profile_photo_name:string;
firstname:string;
lastname:string;
username:string;
password:string;
type:number;

  ngOnInit(): void {
    this.profile_photo_name = "../../assets/images/img_avatar2.png";
  }

  onFileSelected(event){
    this.profile_photo = event.target.files[0];
    this.profile_photo_name = "../../assets/images/" + event.target.files[0].name;
  }

  register(){
    this.service.register(this.firstname, this.lastname, this.username, this.password, this.type).subscribe((res)=>{
        if(res["message"] == "user added") alert("OK");
        else alert("ERROR");
    });
  }
}
