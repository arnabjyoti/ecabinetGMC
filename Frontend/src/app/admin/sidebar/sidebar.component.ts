import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import Swal from "sweetalert2";
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  user: any = '';
  loggedInUser:any ='';
  @Output() collapsedChange = new EventEmitter<boolean>();
  constructor(private authService: AuthService, private router:Router) {
    this.user = {
      userId: this.authService.getUserId(),
      name: this.authService.getUserName(),
      email: this.authService.getEmail(),
      role: this.authService.getRole(),
      department: this.authService.getDepartment(),
      isVoter: this.authService.getIsVoter(),
    };
  }
  ngOnInit(): void {
    console.log("User==", this.user);
    this.loggedInUser = this.getLoggedInUser();
  }

  getLoggedInUser(){
    let usr:any="";    
    if(this.user){
      switch(this.user.role){
        case 'branch_user': 
          usr=this.user.name+"(Branch)";
        break;
        case 'municipal_secretary': 
          usr=this.user.name+"(Municipal Secretary)";
        break;
        case 'commissioner': 
          usr=this.user.name+"(Commissioner)";
        break;
      }
    }
    return usr;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }

  handleLogout = () => {
    Swal.fire({
      title: "Confirmation Message",
      text: `Are you sure! You want to sign out?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/']);
      }
    });    
  };
}
