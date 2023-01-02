import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { WorkshopComponent } from './workshop/workshop.component';


const routes: Routes = [
  {path:'', component: WorkshopComponent},
  {path:'login', component: LoginComponent},
  {path:'admin', component: AdminComponent},
  {path:'admin/edit_user', component: EditUserComponent},
  {path:'user', component: UserComponent},
  {path:'register', component: RegisterComponent},
  {path:'login/admin', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
