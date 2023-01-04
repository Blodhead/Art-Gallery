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
    EditWorkshopComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
