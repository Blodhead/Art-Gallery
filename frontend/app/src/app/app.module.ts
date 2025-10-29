import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrganizerComponent } from './organizer/organizer.component';
import { ParticipantComponent } from './participant/participant.component';
import { RequestComponent } from './request/request.component';
import { ParfumeComponent } from './parfume/parfume.component';
import { ParfumeDetailsComponent } from './parfume-details/parfume-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UserOrganizerComponent } from './user-organizer/user-organizer.component';
import { VerifyComponent } from './verify/verify.component';
import { MyParfumesComponent } from './my-parfumes/my-parfumes.component';
import { FlipModule } from 'ngx-flip';
import { MessageComponent } from './message/message.component';
import { DetailsComponent } from './details/details.component';
import { GalleryModule } from  'ng-gallery';
import { ChatComponent } from './chat/chat.component';
import { ShippmentComponent } from './shippment/shippment.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    RegisterComponent,
    OrganizerComponent,
    ParticipantComponent,
    RequestComponent,
    ParfumeComponent,
    ParfumeDetailsComponent,
    HeaderComponent,
    FooterComponent,
    UserOrganizerComponent,
    VerifyComponent,
    MyParfumesComponent,
    MessageComponent,
    DetailsComponent,
    ChatComponent,
    ShippmentComponent,
  ForgotPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlipModule,
  GalleryModule,
    // NgxSliderModule removed as it is unused
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
