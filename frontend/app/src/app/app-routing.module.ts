import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { ParfumeComponent } from './parfume/parfume.component';
import { EditParfumeComponent } from './edit-parfume/edit-parfume.component';
import { UserOrganizerComponent } from './user-organizer/user-organizer.component';
import { VerifyComponent } from './verify/verify.component';
import { MyParfumesComponent } from './my-parfumes/my-parfumes.component';
import { DetailsComponent } from './details/details.component';
import { ChatComponent } from './chat/chat.component';


const routes: Routes = [
  { path: '', component: ParfumeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/edit_user', component: EditUserComponent },
  { path: 'admin/edit_parfume', component: EditParfumeComponent },
  { path: 'user', component: UserComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login/admin', component: LoginComponent },
  { path: 'user_organizer', component: UserOrganizerComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'MyParfumes', component: MyParfumesComponent },
  { path: 'details', component: DetailsComponent },
  { path: 'chat', component: ChatComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
