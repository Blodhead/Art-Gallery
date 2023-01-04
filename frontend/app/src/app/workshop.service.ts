import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  save(name: string, image: string, description: string, date: string, location: string, likes:String[]) {

    const data = {
      name: name,
      image: image,
      description: description,
      date: date,
      location: location,
      likes:likes
    }

    return this.http.post(`${this.url}/workshop/save`, data);
  }

  constructor(private http: HttpClient) { }

  url = "http://localhost:4000";

  getAllWorkshops() {
    return this.http.get(`${this.url}/workshop/getAllWorkshops`);
  }

}
