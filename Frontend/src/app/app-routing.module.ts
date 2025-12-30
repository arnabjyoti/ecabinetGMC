import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './auth/role.gaurd';
import { AuthGuardService as AuthGuard } from './auth/auth-gaurd.service';
import { HomeComponent } from './client/pages/home/home.component';
import { ClientLayoutComponent } from './client/client-layout/client-layout.component';
import { LoginComponent } from './client/pages/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
// import { MapTestComponent } from './map-test/map-test.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { ApplicationsComponent } from './admin/pages/applications/applications.component';
import { ReportsComponent } from './admin/pages/reports/reports.component';
import { IssueDetailsComponent } from './admin/pages/issue-details/issue-details.component';
import { VotePageComponent } from './admin/pages/vote-page/vote-page.component';
import { MuniSecIssueBucketComponent } from './municipal-secretary/muni-sec-issue-bucket/muni-sec-issue-bucket.component';
import { CommissionerIssueBucketComponent } from './commissioner/commissioner-issue-bucket/commissioner-issue-bucket.component';
import { VotingZoneComponent } from './admin/pages/voting-zone/voting-zone.component';
const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [{ path: '', component: LoginComponent }],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'branch-issue-bucket',
    component: ApplicationsComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'branch_user' },
  },
  {
    path: 'municipal-secretary-issue-bucket',
    component: MuniSecIssueBucketComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'municipal_secretary' },
  },
  {
    path: 'commissioner-issue-bucket',
    component: CommissionerIssueBucketComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'commissioner' },
  },
  {
    path: 'voting-zone',
    component: VotingZoneComponent,
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
