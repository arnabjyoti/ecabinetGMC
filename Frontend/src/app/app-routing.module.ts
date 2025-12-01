import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './auth/role.gaurd';
import { AuthGuardService as AuthGuard } from './auth/auth-gaurd.service';
import { HomeComponent } from './client/pages/home/home.component';
import { ClientLayoutComponent } from './client/client-layout/client-layout.component';
import { LoginComponent } from './client/pages/login/login.component';
import { RegisterComponent } from './client/pages/register/register.component';

import { SaDashboardComponent } from './super-admin/sa-dashboard/sa-dashboard.component';
import { SaAdminLayoutComponent } from './super-admin/sa-admin-layout/sa-admin-layout.component';

import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
// import { MapTestComponent } from './map-test/map-test.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: '',
    component: SaAdminLayoutComponent,
    children: [
      {
        path: 'sa-dashboard',
        component: SaDashboardComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'sa' },
      },
    ],
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
      },
      {
        path: 'my-profile',
        component: AdminProfileComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
      },
    ],
  },


  { path: '**', redirectTo: 'home' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
