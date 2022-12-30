import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  {path:'', component: LoginComponent}, //ako je ruta prazna ucitaj LoginComponent
  {path:'login', component: LoginComponent},
  {path:'admin', component: AdminComponent},
  {path:'admin/edit_user', component: EditUserComponent},
  {path:'user', component: UserComponent},
  {path:'register', component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
