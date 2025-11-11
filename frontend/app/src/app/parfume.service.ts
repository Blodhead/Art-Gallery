import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Message, ParfumeDetails } from './models/parfume-details';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParfumeService {

  constructor(private http: HttpClient) { }


  url = environment.apiUrl;

  comment(name: string, username: string, profile_photo_name: string, message: string, arg4: Date) {

    let data = {
      sent_parfume: name,
      username: username,
      image: profile_photo_name,
      comment: message,
      date: arg4
    }

    return this.http.post(`${this.url}/parfume/comment`, data);

  }

  informAll(participants, parfume_name) {
    let data = {
      participants: participants,
      parfume_name: parfume_name
    }
    return this.http.post(`${this.url}/parfume/informAll`, data);
  }

  uncomment(name: string, comment: Comment) {

    let data = {
      sent_parfume: name,
      sent_comment: comment
    }

    return this.http.post(`${this.url}/parfume/uncomment`, data);

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

    return this.http.post(`${this.url}/parfume/update`, data);
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

    return this.http.post(`${this.url}/parfume/save`, data);
  }

  delete(sent_parfume: ParfumeDetails) {
    return this.http.post(`${this.url}/parfume/deleteParfume`, sent_parfume);
  }


  updateParfume(parfume) {
    let data = {
      parfume: parfume
    }
    return this.http.post(`${this.url}/parfume/updateParfume`, data);
  }

  getAllParfumes() {
    return this.http.get(`${this.url}/parfume/getAllParfumes`);
  }

  getByName(name: string) {
    const encoded = encodeURIComponent(name);
    return this.http.get(`${this.url}/parfume/getByName?name=${encoded}`);
  }

  sub(email, myParfumeDetail, arg) {
    let data = {
      email: email,
      myParfumeDetail: myParfumeDetail,
      status: arg
    }

    return this.http.post(`${this.url}/parfume/sub`, data);
  }

  unsub(email, myParfumeDetail) {
    let data = {
      email: email,
      myParfumeDetail: myParfumeDetail
    }

    return this.http.post(`${this.url}/parfume/unsub`, data);
  }

  reject(participant, myParfume) {
    let data = {
      email: participant,
      myParfumeDetail: myParfume
    }

    return this.http.post(`${this.url}/parfume/reject`, data);
  }

  accept(participant, myParfume) {
    let data = {
      email: participant,
      myParfumeDetail: myParfume
    }

    return this.http.post(`${this.url}/parfume/accept`, data);
  }

  like(name: string, username: string) {
    let data = {
      name: name,
      username: username
    }
    return this.http.post(`${this.url}/parfume/like`, data);;
  }

  unlike(name: string, username: string) {
    let data = {
      name: name,
      username: username
    }
    return this.http.post(`${this.url}/parfume/unlike`, data);
  }

  sendMail(mailing_list, parfume_name) {

    let data = {
      mailing_list: mailing_list,
      parfume_name: parfume_name
    }

    return this.http.post(`${this.url}/parfume/sendMail`, data);
  }


  syncMail(old_mail, new_mail) {
    let data = {
      old_mail: old_mail,
      new_mail: new_mail
    }
    return this.http.post(`${this.url}/parfume/syncMail`, data);
  }

  syncUsername(old_username, new_username) {
    let data = {
      old_username: old_username,
      new_username: new_username
    }
    return this.http.post(`${this.url}/parfume/syncUsername`, data);
  }

  addMessage(parfume: string, message: Message) {
    let data = {
      parfume: parfume,
      message: message
    }
    return this.http.post(`${this.url}/parfume/addMessage`, data);
  }

}
