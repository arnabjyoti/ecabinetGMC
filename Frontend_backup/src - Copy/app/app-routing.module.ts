import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './auth/role.gaurd';
import { AuthGuardService as AuthGuard } from './auth/auth-gaurd.service';
import { HomeComponent } from './client/pages/home/home.component';
import { ClientLayoutComponent } from './client/client-layout/client-layout.component';
import { LoginComponent } from './client/pages/login/login.component';

import { SaDashboardComponent } from './super-admin/sa-dashboard/sa-dashboard.component';
import { SaAdminLayoutComponent } from './super-admin/sa-admin-layout/sa-admin-layout.component';

import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
// import { MapTestComponent } from './map-test/map-test.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { ApplicationsComponent } from './admin/pages/applications/applications.component';
import { ReportsComponent } from './admin/pages/reports/reports.component';
import { IssueDetailsComponent } from './admin/pages/issue-details/issue-details.component';
import { VotePageComponent } from './admin/pages/vote-page/vote-page.component';
const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [{ path: '', component: LoginComponent }],
  },
  {
    path: '',
    component: SaAdminLayoutComponent,
    children: [
      {
        path: 'sa-dashboard',
        component: SaDashboardComponent,
      },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'applications',
    component: ApplicationsComponent,
  },
  { path: 'issue-details/:id', component: IssueDetailsComponent },
  {
    path: 'reports',
    component: ReportsComponent,
  },
  {
    path: 'vote-page',
    component: VotePageComponent,
  },
  {
    path: 'my-profile',
    component: AdminProfileComponent,
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
