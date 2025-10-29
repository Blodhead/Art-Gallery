import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http" //importuj da bi backend i frontend komunicirali preko HTTP zahteva
import { User } from './models/user';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }//servisu se preko injection-a prosledjuje HttpClient da bismo ga mogli koristiti

  url = environment.apiUrl;
  
  login(username, password) {   //metova koja prima parametre
    const data = {              //pakovanje podataka u strukturu radi lakseg slanja backendu
      username: username,
      password: password
    }

    return this.http.post(`${this.url}/users/login`, data); //Salje se post zahtev sa odredjenim zahtevom(1)
    // i slozenim objektom "data"(2) koji sadrzi username i password
  }

  logout(username, token) {
    const data = { username, token };
    return this.http.post(`${this.url}/users/logout`, data);
  }

  register(username, password, email) {
    const data = {
      username: username,
      password: password,
      email: email,
    }

    return this.http.post(`${this.url}/users/register`, data);
  }

  checkMail(email: string) {
    const data = { email };
    return this.http.post(`${this.url}/users/checkMail`, data);
  }

  updateStatus(user: User) {
    return this.http.post(`${this.url}/users/updateStatus`, user);
  }

  update(curr_sent, profile_photo_name, firstname, lastname, username, password, email, phone, type, org_name, state, city, postal_code, street, number, pib, status) {
    const data = {
      curr_sent: curr_sent,
      profile_photo_name: profile_photo_name,
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: password,
      type: type,
      org_name: org_name,
      state: state,
      city: city,
      postal_code: postal_code,
      street: street,
      number: number,
      pib: pib,
      email: email,
      phone: phone,
      status: status
    }

    return this.http.post(`${this.url}/users/update`, data);
  }

  deleteUser(user: User) {
    return this.http.post(`${this.url}/users/deleteUser`, user);
  }
  getTempData() {
    return this.http.get(`${this.url}/users/getTempData`);
  }

  sendMail(email) {
    let data = {
      email: email
    }
    return this.http.post(`${this.url}/users/sendMail`, data);
  }

  // Forgot-password flow
  requestReset(email: string) {
    const data = { email };
    return this.http.post(`${this.url}/users/requestReset`, data);
  }

  verifyCode(email: string, code: string) {
    const data = { email, code };
    return this.http.post(`${this.url}/users/verifyCode`, data);
  }

  resetPassword(email: string, code: string, new_pass: string) {
    const data = { email, code, new_pass };
    return this.http.post(`${this.url}/users/resetPassword`, data);
  }

  updatePassword(username, new_pass) {
    let data = {
      username: username,
      new_pass: new_pass
    }
    
    return this.http.post(`${this.url}/users/updatePassword`, data);
  }

  changePassword(username, old_pass, new_pass) {
    const data = { username, old_pass, new_pass };
    return this.http.post(`${this.url}/users/changePassword`, data);
  }

  order(email, cart, shipping) {
    const data = { email, cart, shipping };
    return this.http.post(`${this.url}/users/order`, data);
  }
}
