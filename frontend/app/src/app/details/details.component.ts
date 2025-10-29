import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { MapService } from '../map.service';
import { User } from '../models/user';
import { ParfumeDetails } from '../models/parfume-details';
import { ParfumeService } from '../parfume.service';
import { Title, Meta } from '@angular/platform-browser';

declare var ol: any;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor(private map_service: MapService, private parfume_service: ParfumeService, private _router: Router, private route: ActivatedRoute, private title: Title, private meta: Meta) { }
  latitude: number = 20.4762358;
  longitude: number = 44.8057154;
  ngOnInit(): void {
    // Try to read product name from route param and fetch from backend.
    this.current_user = JSON.parse(localStorage.getItem("current_user"));

    const nameParam = this.route.snapshot.paramMap.get('name');
    if (nameParam) {
      const decoded = decodeURIComponent(nameParam);
      this.parfume_service.getByName(decoded).subscribe((p: any) => {
        if (!p) { this._router.navigate([""]); return; }
        this.myParfume = p;
        this.setMetaFromParfume(p);
        this.images = this.getImages();
        this.initMap();
      }, err => {
        console.error('getByName error', err);
        // fallback to localStorage if available
        const local = JSON.parse(localStorage.getItem("detail_sent"));
        if (local) {
          this.myParfume = local;
          this.setMetaFromParfume(local);
          this.images = this.getImages();
          this.initMap();
        } else {
          this._router.navigate([""]);
        }
      });
    } else {
      // no param — fallback to previous behaviour
      this.myParfume = JSON.parse(localStorage.getItem("detail_sent"));
      if (!this.myParfume) { this._router.navigate([""]); return; }
      this.setMetaFromParfume(this.myParfume);
      this.images = this.getImages();
      this.initMap();
    }

    //this.bgimage = this.myParfume.image;
    // moved map init into initMap() called when parfume available
  }

  private initMap() {
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.latitude, this.longitude]),
        zoom: 17
      })
    });
    this.search();

    }

  private setMetaFromParfume(p: any) {
    try {
      const title = p.name || p.parfumename || 'Product';
      const desc = (p.long_desc && p.long_desc.toString().slice(0, 150)) || p.description || '';
      this.title.setTitle(title + ' - Finest Miris');
      this.meta.updateTag({ name: 'description', content: desc });
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ property: 'og:description', content: desc });
      if (p.img_location) this.meta.updateTag({ property: 'og:image', content: p.img_location });
      // set canonical link
      try {
        const existingCanonical = document.querySelector('link[rel="canonical"]');
        const canonicalHref = window.location.origin + '/details/' + encodeURIComponent(p.name || p.parfumename || '');
        if (existingCanonical) (existingCanonical as HTMLLinkElement).href = canonicalHref;
        else {
          const l = document.createElement('link');
          l.rel = 'canonical';
          l.href = canonicalHref;
          document.head.appendChild(l);
        }
      } catch (e) { /* ignore */ }
      // add JSON-LD product schema for better indexing
      this.addJsonLdForProduct(p);
    } catch (e) { console.warn('setMetaFromParfume error', e); }
  }

  private addJsonLdForProduct(p: any) {
    try {
      const existing = document.getElementById('ld-json-product');
      if (existing) existing.remove();
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'ld-json-product';
      const json: any = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        'name': p.name || p.parfumename,
        'image': p.img_location ? [p.img_location] : [],
        'description': p.long_desc || p.description || '',
        'offers': {
          '@type': 'Offer',
          'price': (p.price != null) ? p.price.toString() : undefined,
          'priceCurrency': 'RSD'
        }
      };
      script.innerText = JSON.stringify(json);
      document.head.appendChild(script);
    } catch (e) { console.warn('addJsonLdForProduct err', e); }
  }
    /*for (let i = 0; i < this.myParfume.participants.length; i++) {
      if (this.myParfume.participants[i].status == "waiting")
        this.waitingParticipants.push(this.myParfume.participants[i].email);
      else if (this.myParfume.participants[i].status == "approved")
        this.subscribedParticipants.push(this.myParfume.participants[i].email);
    }*/

  myParfume: ParfumeDetails = null;
  images: GalleryItem[] = [];
  map: any;
  long_desc: String;
  bgimage: string;
  current_user: User;
  waitingParticipants: string[] = [];
  subscribedParticipants: string[] = [];

  getImages(): GalleryItem[] {
    /*let temp_gallery: GalleryItem[] = [];
    for (let i = 0; i < this.myParfume.gallery.length; i++) {
      temp_gallery.push(new ImageItem({ src: this.myParfume.gallery[i], thumb: this.myParfume.gallery[i] }));
    }
    if (this.myParfume.gallery.length == 0) {
      temp_gallery.push(new ImageItem({ src: this.myParfume.image, thumb: this.myParfume.image }));
    }
    return temp_gallery;*/
    return null;
  }
  err_message: string = '';
  search() {
    /*this.map_service.getLongLat(this.myParfume.location).subscribe((address: any) => {

      if (address.features[0] == null) { this.err_message = "Location doesn't exist!"; return; }
      this.err_message = '';
      this.latitude = address.features[0].geometry.coordinates[1];
      this.longitude = address.features[0].geometry.coordinates[0];

      this.setCenter();
    });*/
  }

  setCenter() {
    var view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat([this.longitude, this.latitude]));
    view.setZoom(17);
  }

  /*check() {
    if (this.current_user.type == "organizer" && this.current_user.username == this.myParfume.owner)
      return true;
    else return false;
  }*/

  reject(participant: string) {
    for (let iter = 0; iter < this.waitingParticipants.length; iter++) {
      if (this.waitingParticipants[iter] == participant) {

        /*for (let x = 0; x < this.myParfume.participants.length; x++) {
          if (this.myParfume.participants[x].email == this.waitingParticipants[iter]) {
            this.myParfume.participants[x] = null;
            break;
          }

        }*/

        /*this.myParfume.participants = this.myParfume.participants.filter(elements => {
          return (elements != null && elements !== undefined);
        });*/

        localStorage.setItem("detail_sent", JSON.stringify(this.myParfume));

        this.waitingParticipants[iter] = null;
        this.waitingParticipants = this.waitingParticipants.filter(elements => {
          return (elements != null && elements !== undefined);
        });
        break;
      }
    }

    /*this.parfume_service.reject(participant, this.myParfume).subscribe((statement) => {
      if (statement) localStorage.setItem("detail_sent", JSON.stringify(this.myParfume));
      else alert("err");
    });*/

  }
  accept(participant) {

    /*for (let iter = 0; iter < this.waitingParticipants.length; iter++) {
      if (this.waitingParticipants[iter] == participant) {
        for (let x = 0; x < this.myParfume.participants.length; x++) {
          if (this.myParfume.participants[x].email == this.waitingParticipants[iter]) {
            this.myParfume.participants[x].status = "approved";
            break;
          }

        }
        localStorage.setItem("detail_sent", JSON.stringify(this.myParfume));
        this.waitingParticipants[iter] = null;
        this.waitingParticipants = this.waitingParticipants.filter(elements => {
          return (elements != null && elements !== undefined);
        });
        break;
      }
    }*/

    this.subscribedParticipants.push(participant);

    this.parfume_service.accept(participant, this.myParfume).subscribe((statement) => {
      if (statement) localStorage.setItem("detail_sent", JSON.stringify(this.myParfume));

      else alert("err");
    });
  }

  contact() {
    localStorage.setItem("sent_parfume", JSON.stringify(this.myParfume));
    this._router.navigate(["chat"]);
  }

}
