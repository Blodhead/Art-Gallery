import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { WorkshopComponent } from './workshop/workshop.component';
import { EditWorkshopComponent } from './edit-workshop/edit-workshop.component';
import { UserOrganizerComponent } from './user-organizer/user-organizer.component';
import { VerifyComponent } from './verify/verify.component';
import { MyWorkshopsComponent } from './my-workshops/my-workshops.component';
import { DetailsComponent } from './details/details.component';
import { ChatComponent } from './chat/chat.component';


const routes: Routes = [
  { path: '', component: WorkshopComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/edit_user', component: EditUserComponent },
  { path: 'admin/edit_workshop', component: EditWorkshopComponent },
  { path: 'user', component: UserComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login/admin', component: LoginComponent },
  { path: 'user_organizer', component: UserOrganizerComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'MyWorkshops', component: MyWorkshopsComponent },
  { path: 'details', component: DetailsComponent },
  { path: 'chat', component: ChatComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
