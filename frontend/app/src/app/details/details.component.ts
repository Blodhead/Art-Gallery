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
  template: `<gallery [items]="images"></gallery>`,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor(
    private map_service: MapService,
    private parfume_service: ParfumeService,
    private _router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta
  ) { }
  latitude: number = 20.4762358;
  longitude: number = 44.8057154;
  ngOnInit(): void {
    // If a ?name=... query param exists, fetch that product server-side via API.
    this.route.queryParams.subscribe(params => {
      const name = params['name'];
      if (name) {
        this.parfume_service.getByName(name).subscribe((p: any) => {
          if (p) {
            this.myParfume = p;
            localStorage.setItem('detail_sent', JSON.stringify(this.myParfume));
            this.setMetaFromParfume(this.myParfume);
            this.images = this.getImages();
          } else {
            // fallback to localStorage
            this.loadFromLocalStorage();
          }
        }, (err) => {
          this.loadFromLocalStorage();
        });
      } else {
        this.loadFromLocalStorage();
      }
    });
    //this.long_desc = this.myParfume.long_desc;
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

    /*for (let i = 0; i < this.myParfume.participants.length; i++) {
      if (this.myParfume.participants[i].status == "waiting")
        this.waitingParticipants.push(this.myParfume.participants[i].email);
      else if (this.myParfume.participants[i].status == "approved")
        this.subscribedParticipants.push(this.myParfume.participants[i].email);
    }*/

  }

  loadFromLocalStorage() {
    this.myParfume = JSON.parse(localStorage.getItem('detail_sent'));
    this.current_user = JSON.parse(localStorage.getItem('current_user'));
    if (this.current_user == null) this._router.navigate(['login']);
    if (this.myParfume == null) this._router.navigate(['']);
    this.images = this.getImages();
    this.setMetaFromParfume(this.myParfume);
  }

  setMetaFromParfume(p: any) {
    if (!p) return;
    const site = 'Finest Miris';
    const title = `${p.name || p.parfumename || 'Parfume'} — ${site}`;
    const description = p.description || (p.long_desc ? (p.long_desc as string).slice(0, 150) : '') || (`${site} — shop the best parfumes.`);
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    if (p.img_location || p.image) {
      const img = p.img_location || p.image;
      this.metaService.updateTag({ property: 'og:image', content: img });
    }
    // canonical only in browser (guard for SSR)
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      const link: HTMLLinkElement = document.querySelector("link[rel='canonical']") || document.createElement('link');
      link.setAttribute('rel', 'canonical');
      const base = (window && window.location) ? window.location.origin : '';
      const nameSegment = encodeURIComponent(p.name || p.parfumename || '');
      link.setAttribute('href', `${base}/details?name=${nameSegment}`);
      if (!document.querySelector("link[rel='canonical']")) document.head.appendChild(link);
    }

    // Build JSON-LD string for server-side rendering / prerender
    this.buildJsonLd(p);
  }

  buildJsonLd(p: any) {
    try {
      const product: any = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": p.name || p.parfumename || '',
        "image": [p.img_location || p.image || ""],
        "description": p.description || (p.long_desc ? (p.long_desc as string).slice(0, 300) : ''),
        "sku": p.sku || p._id || '',
        "brand": {
          "@type": "Brand",
          "name": p.brand || 'Finest Miris'
        }
      };

      if (p.price || p.amount) {
        product.offers = {
          "@type": "Offer",
          "url": (typeof window !== 'undefined' && window.location) ? window.location.href : '',
          "priceCurrency": (p.currency || 'RSD'),
          "price": (p.price || p.amount || ''),
          "availability": p.in_stock || p.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
        };
      }

      this.jsonLd = JSON.stringify(product);
    } catch (e) {
      console.warn('buildJsonLd error', e);
      this.jsonLd = '';
    }
  }

  myParfume: ParfumeDetails = null;
  images: GalleryItem[] = [];
  jsonLd: string = '';
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
