import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  step: 'email' | 'code' | 'reset' | 'done' = 'email';
  email: string = '';
  code: string = '';
  new_password: string = '';
  confirm_password: string = '';
  message: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  sendCode() {
    this.error = '';
    if (!this.email) { this.error = 'Enter your email'; return; }
    this.loading = true;
    this.userService.requestReset(this.email).subscribe((res: any) => {
      this.loading = false;
      this.message = 'Mail sent. Check your inbox for the verification code.';
      this.step = 'code';
    }, err => {
      console.error(err);
      this.loading = false;
      // still move to code step to avoid leaking
      this.message = 'Mail sent. Check your inbox for the verification code.';
      this.step = 'code';
    });
  }

  verify() {
    this.error = '';
    if (!this.code) { this.error = 'Enter the code you received'; return; }
    this.loading = true;
    this.userService.verifyCode(this.email, this.code).subscribe((res: any) => {
      this.loading = false;
      this.step = 'reset';
    }, err => {
      console.error(err);
      this.loading = false;
      this.error = (err && err.error && err.error.message) ? err.error.message : 'Code verification failed';
    });
  }

  reset() {
    this.error = '';
    if (!this.new_password || !this.confirm_password) { this.error = 'Enter and confirm new password'; return; }
    if (this.new_password !== this.confirm_password) { this.error = 'Passwords do not match'; return; }
    this.loading = true;
    this.userService.resetPassword(this.email, this.code, this.new_password).subscribe((res: any) => {
      this.loading = false;
      this.step = 'done';
      // optionally redirect to login after short delay
      setTimeout(() => this.router.navigate(['/login']), 2000);
    }, err => {
      console.error(err);
      this.loading = false;
      this.error = (err && err.error && err.error.message) ? err.error.message : 'Password reset failed';
    });
  }
}
