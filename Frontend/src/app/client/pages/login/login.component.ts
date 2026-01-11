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
  email:any = '';
  otp:any = '';
  otpSent:any = false;
  // message = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}


  close(drawer: any) {
    drawer.close();
  }


  sendOtp() {
    console.log('OTP sent to', this.email);
    if(!this.email){
      this.toastr.warning('Please enter your registered email id','Warning Message');
      return;
    }
    this.spinner.show();
    this.authService.requestOtp("", this.email).subscribe({
      next: (res) => {
        console.log('RES==', res);
        if (res?.status) {
          this.otpSent = true;
          this.toastr.success(res.message, 'Success Message');
        } else {
          this.otpSent = false;
          this.toastr.error(res.message, 'Error Message');
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.otpSent = false;
        this.toastr.error('Failed to send OTP','Error Message');
        this.spinner.hide();
      },
    });
  }

  verifyOtp() {
    this.authService.verifyOtp("", this.email, this.otp).subscribe({
      next: (res) => {
        this.authService.storeTokens(res.accessToken, res.refreshToken);
        this.toastr.success('Login successful!', 'Success Message');
        const role = this.authService.getRole();
        if (role === 'branch_user') {
           this.router.navigate(['/dashboard']);
        } else if (role === 'municipal_secretary') {
          this.router.navigate(['/dashboard']);
        } else if (role === 'commissioner') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/unknown-role']);
        }
      },
      error: () => {
        this.toastr.error('Invalid or expired OTP','Error Message');
      },
    });
  }

  // onSubmit() {
  //   console.log('Login form submitted', {
  //     email: this.email,
  //     password: this.password,
  //     otp: this.otp,
  //   });

  //   // Example login check
  //   const found = users.find(
  //     (u) => u.email === this.email && u.password === this.password
  //   );

  //   if (found) {
  //     console.log('LOGIN SUCCESS', found);

  //     localStorage.setItem('user', JSON.stringify(found));
  //     // sessionStorage.setItem('issues', JSON.stringify(issues));

  //     this.toastr.success('Login Successful');

  //     if (found.role === 'branch') {
  //       this.router.navigate(['/dashboard']);
  //     }
  //     if (found.role === 'municipal_secretary') {
  //       this.router.navigate(['/dashboard']);
  //     }
  //     if (found.role === 'commissioner') {
  //       this.router.navigate(['/dashboard']);
  //     }
  //   } else {
  //     console.log('LOGIN FAILED');
  //     this.toastr.error('Invalid email or password', 'Error');
  //   }

  //   // Login API call here
  // }
}
