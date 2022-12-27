import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http:HttpClient) { }

url="http://localhost:4000";

  getAllNews(){
    return this.http.get(`${this.url}/news/getAllNews`);
  }


  addComment(id, text){
    const data = {
      id: id,
      comment: text
    }
    return this.http.post(`${this.url}/news/addComment`,data);
  }
}
