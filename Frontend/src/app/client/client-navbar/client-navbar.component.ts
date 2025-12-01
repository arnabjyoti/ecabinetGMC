import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-client-navbar',
  templateUrl: './client-navbar.component.html',
  styleUrls: ['./client-navbar.component.css']
})
export class ClientNavbarComponent implements OnInit {
  isLoggedIn:any={
    SA:false,
    Admin:false
  }
  constructor(private authService:AuthService){}
  ngOnInit(): void {
  }

}
