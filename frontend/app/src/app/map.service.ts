import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService implements OnInit {

  constructor(private http: HttpClient) { }

  getLongLat(adresa: string) {
    return this.http.get(`https://nominatim.openstreetmap.org/search?q=${adresa}&format=geojson`,
      { responseType: 'json' })
  }

  ngOnInit(): void {

  }
}
