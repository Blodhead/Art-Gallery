import { Component, OnInit } from '@angular/core';
import { News } from '../models/news';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

  
  constructor(private service: NewsService){}
  ngOnInit(): void {
    this.service.getAllNews().subscribe((data:News[])=>{
      this.news = data;
    })
  }

  news: News[] = []

  Myid: number;
  comment:string;

  add(){
    this.service.addComment(this.Myid, this.comment).subscribe(resp=>{
      alert(resp["message"]);
    })
  }
}
