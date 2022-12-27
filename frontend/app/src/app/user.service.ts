import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http" //importuj da bi backend i frontend komunicirali preko HTTP zahteva

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

  register(firstname, lastname, username, password, type) {
    const data = {
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: password,
      type: type
    }

    return this.http.post(`${this.url}/users/register`, data);
  }
}
