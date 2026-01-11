import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {AuthService} from './auth/auth.service';
import { AuthGuardService } from './auth/auth-gaurd.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ClientLayoutComponent } from './client/client-layout/client-layout.component';
import { ClientNavbarComponent } from './client/client-navbar/client-navbar.component';
import { ClientFooterComponent } from './client/client-footer/client-footer.component';
import { HomeComponent } from './client/pages/home/home.component';
import { LoginComponent } from './client/pages/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { RegisterComponent } from './client/pages/register/register.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { QuillModule } from 'ngx-quill';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { ApplicationsComponent } from './admin/pages/applications/applications.component';
import { ReportsComponent } from './admin/pages/reports/reports.component';
import { TableComponent } from './components/table/table.component';
import { IssueDetailsComponent } from './admin/pages/issue-details/issue-details.component';
import { VotePageComponent } from './admin/pages/vote-page/vote-page.component';
import { MuniSecIssueBucketComponent } from './municipal-secretary/muni-sec-issue-bucket/muni-sec-issue-bucket.component';
import { CommissionerIssueBucketComponent } from './commissioner/commissioner-issue-bucket/commissioner-issue-bucket.component';
import { VotingZoneComponent } from './admin/pages/voting-zone/voting-zone.component';
import { MayorIssueBucketComponent } from './mayor/mayor-issue-bucket/mayor-issue-bucket.component';
// import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientLayoutComponent,
    ClientNavbarComponent,
    ClientFooterComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    FileUploadComponent,
    AdminProfileComponent,
    LoaderComponent,
    SidebarComponent,
    ApplicationsComponent,
    ReportsComponent,
    TableComponent,
    IssueDetailsComponent,
    VotePageComponent,
    MuniSecIssueBucketComponent,
    CommissionerIssueBucketComponent,
    VotingZoneComponent,
    MayorIssueBucketComponent
  ],
  imports: [
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatSlideToggleModule,
    NgxSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    FlexLayoutModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    QuillModule.forRoot(),

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthService, AuthGuardService, DatePipe, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
