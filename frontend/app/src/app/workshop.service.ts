import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  constructor(private http: HttpClient) { }

  url = "http://localhost:4000";

  getAllWorkshops(){
    return this.http.get(`${this.url}/workshop/getAllWorkshops`);
  }

}
