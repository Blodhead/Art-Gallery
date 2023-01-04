import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  save(name: string, image: string, description: string, date: Date, location: string) {

    const data = {
      name: name,
      image: image,
      description: description,
      date: date,
      location: location
    }

    return this.http.post(`${this.url}/workshop/save`, data);
  }

  constructor(private http: HttpClient) { }

  url = "http://localhost:4000";

  getAllWorkshops() {
    return this.http.get(`${this.url}/workshop/getAllWorkshops`);
  }

}
