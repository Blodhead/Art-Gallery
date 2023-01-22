import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterComponent } from './register/register.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrganizerComponent } from './organizer/organizer.component';
import { ParticipantComponent } from './participant/participant.component';
import { RequestComponent } from './request/request.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { WorkshopComponent } from './workshop/workshop.component';
import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';
import { EditWorkshopComponent } from './edit-workshop/edit-workshop.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UserOrganizerComponent } from './user-organizer/user-organizer.component';
import { VerifyComponent } from './verify/verify.component';
import { MyWorkshopsComponent } from './my-workshops/my-workshops.component';
import { FlipModule } from 'ngx-flip';
import { MessageComponent } from './message/message.component';
import { DetailsComponent } from './details/details.component';
import { GalleryModule } from  'ng-gallery';
import { ChatComponent } from './chat/chat.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    AdminComponent,
    RegisterComponent,
    OrganizerComponent,
    ParticipantComponent,
    RequestComponent,
    EditUserComponent,
    WorkshopComponent,
    WorkshopDetailsComponent,
    EditWorkshopComponent,
    HeaderComponent,
    FooterComponent,
    UserOrganizerComponent,
    VerifyComponent,
    MyWorkshopsComponent,
    MessageComponent,
    DetailsComponent,
    ChatComponent,
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
    GalleryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
