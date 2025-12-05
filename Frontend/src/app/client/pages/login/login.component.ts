import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/auth.service';
// import * as users from 'users.json';
import users from 'src/assets/dummy/users.json';
import issues from 'src/assets/dummy/issues.json';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  // useEmail = true;
  // mobile = '';
  // email = '';
  // otp = '';
  // otpSent = false;
  // message = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  email: string = '';
  password: string = '';
  otp: string = '';

  sendOtp() {
    console.log('OTP sent to', this.email);
    // Call API here
  }

  onSubmit() {
    console.log('Login form submitted', {
      email: this.email,
      password: this.password,
      otp: this.otp,
    });

    // Example login check
    const found = users.find(
      (u) => u.email === this.email && u.password === this.password
    );

    if (found) {
      console.log('LOGIN SUCCESS', found);

      localStorage.setItem('user', JSON.stringify(found));
      // sessionStorage.setItem('issues', JSON.stringify(issues));


      this.toastr.success('Login Successful');

      if (found.role === 'branch') {
        this.router.navigate(['/dashboard']);
      }
      if (found.role === 'municipal_secretary') {
        this.router.navigate(['/dashboard']);
      }
      if (found.role === 'commissioner') {
        this.router.navigate(['/dashboard']);
      }
    } else {
      console.log('LOGIN FAILED');
      this.toastr.error('Invalid email or password', 'Error');
    }

    // Login API call here
  }
}
