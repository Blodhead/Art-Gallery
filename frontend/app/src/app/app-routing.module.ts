import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ParfumeComponent } from './parfume/parfume.component';
import { VerifyComponent } from './verify/verify.component';
import { MyParfumesComponent } from './my-parfumes/my-parfumes.component';
import { DetailsComponent } from './details/details.component';
import { ShippmentComponent } from './shippment/shippment.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


const routes: Routes = [
  { path: '', component: ParfumeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login/admin', component: LoginComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'MyParfumes', component: MyParfumesComponent },
  { path: 'details', component: DetailsComponent },
  ,{ path: 'shippment', component: ShippmentComponent }
  ,{ path: 'forgot-password', component: ForgotPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
