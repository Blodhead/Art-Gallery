import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { WorkshopDetails } from './models/workshop-details';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  update(_name: string, name: string, image: string, description: string, date: Date, location: string, likes: string[]) {
    const data = {
      _name: _name,
      name: name,
      image: image,
      description: description,
      date: date,
      location: location,
      likes: likes
    }

    return this.http.post(`${this.url}/workshop/update`, data);
  }
  save(name: string, image: string, description: string, date: Date, location: string, likes: String[]) {

    const data = {
      name: name,
      image: image,
      description: description,
      date: date,
      location: location,
      likes: likes
    }

    return this.http.post(`${this.url}/workshop/save`, data);
  }

  delete(sent_workshop: WorkshopDetails) {
    return this.http.post(`${this.url}/workshop/deleteWorkshop`, sent_workshop);
  }

  constructor(private http: HttpClient) { }

  url = "http://localhost:4000";

  getAllWorkshops() {
    return this.http.get(`${this.url}/workshop/getAllWorkshops`);
  }

  sub(mail, myWorkshopDetail) {
    let data = {
      mail: mail,
      myWorkshopDetail: myWorkshopDetail
    }

    return this.http.post(`${this.url}/workshop/sub`, data);
  }

  unsub(mail, myWorkshopDetail) {
    let data = {
      mail: mail,
      myWorkshopDetail: myWorkshopDetail
    }

    return this.http.post(`${this.url}/workshop/unsub`, data);
  }

  like(name: string, username: string) {
    let data = {
      name:name,
      username:username
    }
    return this.http.post(`${this.url}/workshop/like`, data);;
  }

  unlike(name: string, username: string) {
    let data = {
      name:name,
      username:username
    }
    return this.http.post(`${this.url}/workshop/unlike`, data);;
  }

}
