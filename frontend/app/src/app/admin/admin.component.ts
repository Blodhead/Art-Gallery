import { Component, OnInit } from '@angular/core';
import { News } from '../models/news';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  constructor(private service:NewsService){}
  ngOnInit(): void {
    this.service.getAllNews().subscribe((data: News[])=>{
      this.news = data;
    })
  }

  news: News[] = []
}
