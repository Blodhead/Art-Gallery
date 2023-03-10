import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Message, WorkshopDetails } from './models/workshop-details';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  constructor(private http: HttpClient) { }

  url = "http://localhost:4000";

  comment(name: string, username: string, profile_photo_name: string, message: string, arg4: Date) {

    let data = {
      sent_workshop: name,
      username: username,
      image: profile_photo_name,
      comment: message,
      date: arg4
    }

    return this.http.post(`${this.url}/workshop/comment`, data);

  }

  informAll(participants, workshop_name) {
    let data = {
      participants: participants,
      workshop_name: workshop_name
    }
    return this.http.post(`${this.url}/workshop/informAll`, data);
  }

  uncomment(name: string, comment: Comment) {

    let data = {
      sent_workshop: name,
      sent_comment: comment
    }

    return this.http.post(`${this.url}/workshop/uncomment`, data);

  }

  update(_name: string, name: string, image: string, description: string, date: Date, location: string, likes: string[], gallery: string[], long_desc: string, owner: string, free_spaces: number) {
    const data = {
      _name: _name,
      name: name,
      image: image,
      description: description,
      date: date,
      location: location,
      likes: likes,
      gallery: gallery,
      long_desc: long_desc,
      owner: owner,
      free_spaces: free_spaces
    }

    return this.http.post(`${this.url}/workshop/update`, data);
  }
  save(name: string, image: string, description: string, date: Date, location: string, likes: String[], gallery: string[], long_desc: string, owner: string, free_spaces: number) {

    const data = {
      name: name,
      image: image,
      description: description,
      date: date,
      location: location,
      likes: likes,
      gallery: gallery,
      long_desc: long_desc,
      owner: owner,
      free_spaces: free_spaces,
      status: "waiting"
    }

    return this.http.post(`${this.url}/workshop/save`, data);
  }

  delete(sent_workshop: WorkshopDetails) {
    return this.http.post(`${this.url}/workshop/deleteWorkshop`, sent_workshop);
  }


  updateWorkshop(workshop) {
    let data = {
      workshop: workshop
    }
    return this.http.post(`${this.url}/workshop/updateWorkshop`, data);
  }

  getAllWorkshops() {
    return this.http.get(`${this.url}/workshop/getAllWorkshops`);
  }

  sub(mail, myWorkshopDetail, arg) {
    let data = {
      mail: mail,
      myWorkshopDetail: myWorkshopDetail,
      status: arg
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

  reject(participant, myWorkshop) {
    let data = {
      mail: participant,
      myWorkshopDetail: myWorkshop
    }

    return this.http.post(`${this.url}/workshop/reject`, data);
  }

  accept(participant, myWorkshop) {
    let data = {
      mail: participant,
      myWorkshopDetail: myWorkshop
    }

    return this.http.post(`${this.url}/workshop/accept`, data);
  }

  like(name: string, username: string) {
    let data = {
      name: name,
      username: username
    }
    return this.http.post(`${this.url}/workshop/like`, data);;
  }

  unlike(name: string, username: string) {
    let data = {
      name: name,
      username: username
    }
    return this.http.post(`${this.url}/workshop/unlike`, data);
  }

  sendMail(mailing_list, workshop_name) {

    let data = {
      mailing_list: mailing_list,
      workshop_name: workshop_name
    }

    return this.http.post(`${this.url}/workshop/sendMail`, data);
  }


  syncMail(old_mail, new_mail) {
    let data = {
      old_mail: old_mail,
      new_mail: new_mail
    }
    return this.http.post(`${this.url}/workshop/syncMail`, data);
  }

  syncUsername(old_username, new_username) {
    let data = {
      old_username: old_username,
      new_username: new_username
    }
    return this.http.post(`${this.url}/workshop/syncUsername`, data);
  }

  addMessage(workshop: string, message: Message) {
    let data = {
      workshop: workshop,
      message: message
    }
    return this.http.post(`${this.url}/workshop/addMessage`, data);
  }

}
