import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/auth.service';
// import * as users from 'users.json';
import users from 'src/assets/dummy/users.json';
import issues from 'src/assets/dummy/issues.json';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email:any = '';
  password:any='';
  newPassword:any='';
  otp:any = '';
  otpSent:any = false;
  forgotPass:any = false;
  showOtp:any = false;
  form: FormGroup;
  

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.form = new FormGroup(
      {
        //email: new FormControl('',[Validators.required,Validators.email]),
      newPassword: new FormControl('',[Validators.required]),
      confirmPassword: new FormControl('',[Validators.required]),
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }
  passwordMatchValidator(control: AbstractControl) {
    return control.get('newPassword')?.value === control.get('confirmPassword')?.value
    ? null 
    : {mismatch: true}
  }

  


  close(drawer: any) {
    drawer.close();
  }

  showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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
          this.otpSent = true; this.showOtp = false;
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

  login() {
    console.log("Email:", this.email);
    console.log("Password:", this.password);
    if(!this.email){
      this.toastr.warning('Please enter your registered email id','Warning Message');
      return;
    }
    if(!this.password){
      this.toastr.warning('Please enter your password','Warning Message');
      return;
    }
    this.spinner.show();
    this.authService.requestLogin(this.email,this.password).subscribe({
      next: (res) => {
        console.log('RES==', res);
        if(res?.status) {
          this.toastr.success(res.message, 'Sucess Message');
          this.authService.storeTokens(res.accessToken, res.refreshToken);
          const role = this.authService.getRole(); console.log(role);
          switch(role){
            case 'branch_user': 
            case 'counselor': 
            case 'municipal_secretary': 
            case 'commissioner': 
            case 'mayor':
              this.spinner.hide();
              let ele:any = document.getElementById('loginModal');
              ele.click();
               this.router.navigate(['/dashboard']);
            break;
            default:
              this.spinner.hide();
              this.router.navigate(['/unknown-role']);
            break;
          }
        } else {
          this.toastr.error(res.message, 'Error Message');
        }
        this.spinner.hide();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Failed to login please try after some time','Error Message');
        this.spinner.hide();
      },
    });
  }

  forgotPassword() { 
    this.forgotPass = true;
    this. showOtp = true;
  }
  resetPassword() {
    this.authService.resetPassword(this.email,this.newPassword, this.otp).subscribe({
      next: (res)=> {
          if(res.status === 200) {
            this.toastr.success(res.message, 'Success Message');
            this.otpSent = false;
            this.forgotPass = false;
          } else if (res.status === 400) {
            this.toastr.error(res.message, 'Error Message');
          }  
      },
      error: (err)=>{
        this.toastr.error(err, 'Error Message');
      }
    })
  }

  verifyOtp() {
    this.authService.verifyOtp("", this.email, this.otp).subscribe({
      next: (res) => {
        this.authService.storeTokens(res.accessToken, res.refreshToken);
        this.toastr.success('Login successful!', 'Success Message');
        const role = this.authService.getRole();
        switch(role){
          case 'branch_user': 
          case 'municipal_secretary': 
          case 'commissioner': 
          case 'mayor':
            let ele:any = document.getElementById('loginModal');
            ele.click();
             this.router.navigate(['/dashboard']);
          break;
          default:
            this.router.navigate(['/unknown-role']);
          break;
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
