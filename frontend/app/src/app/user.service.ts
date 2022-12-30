import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http" //importuj da bi backend i frontend komunicirali preko HTTP zahteva
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }//servisu se preko injection-a prosledjuje HttpClient da bismo ga mogli koristiti

  url = "http://localhost:4000";

  login(username, password) {   //metova koja prima parametre
    const data = {              //pakovanje podataka u strukturu radi lakseg slanja backendu
      username: username,
      password: password
    }

    return this.http.post(`${this.url}/users/login`, data); //Salje se post zahtev sa odredjenim zahtevom(1)
    // i slozenim objektom "data"(2) koji sadrzi username i password
  }

  register(profile_photo_name, firstname, lastname, username, password, mail, phone, type, org_name, state, city, postal_code,street, number, pib,status) {
    const data = {
      profile_photo_name:profile_photo_name,
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: password,
      type: type,
      org_name:org_name,
      state:state,
      city:city,
      postal_code:postal_code,
      street:street,
      number:number,
      pib:pib, 
      mail:mail, 
      phone:phone,
      status:status
    }

    return this.http.post(`${this.url}/users/register`, data);
  }

  updateStatus(user: User) {
    return this.http.post(`${this.url}/users/updateStatus`, user);
  }

  deleteUser(user:User){
    return this.http.post(`${this.url}/users/deleteUser`, user);
  }

  getTempData() {
    return this.http.get(`${this.url}/users/getTempData`);
  }
}
