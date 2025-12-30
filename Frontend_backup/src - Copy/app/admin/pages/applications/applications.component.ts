import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApplicationsService } from './applications.service';
import { AuthService } from '../../../auth/auth.service';
import issues from 'src/assets/dummy/issues.json';

type MailType = 'inbox' | 'sent' | 'draft';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css'],
})
export class ApplicationsComponent implements OnInit {
  sidebarCollapsed = false;
  activeTab: MailType = 'inbox';
  issues: any = {
    inbox: [],
    sent: [],
    draft: [],
  };
  // issues: any = {
  //   inbox: [
  //     { from: 'HR Team', subject: 'Interview Update', time: '10:30 AM' },
  //     { from: 'Admin', subject: 'Policy Update', time: 'Yesterday' },
  //   ],
  //   sent: [{ to: 'Manager', subject: 'Weekly Report', time: 'Mon' }],
  //   draft: [{ subject: 'Unfinished Proposal', time: 'Saved' }],
  // };

  issue: any = {
    title: '',
    ward: '',
    location: '',
    description: '',
  };
  user:any="";
  isDetailView:boolean=false;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authService:AuthService,
    private applicationsService: ApplicationsService
  ) {
    this.user={
      userId: this.authService.getUserId(),
      email: this.authService.getEmail(),
      role: this.authService.getRole(),
      department: this.authService.getDepartment()
    }
  }

  ngOnInit(): void {
    console.log("USERRR=>",this.user);
    this.getIssueList();
  }

  onSidebarToggle(val: boolean) {
    this.sidebarCollapsed = val;
  }

  selectTab(tab: MailType) {
    this.activeTab = tab;
    this.isDetailView = false;
  }

  getIssueList() {
    let requestObject: any = {
      role: this.user.role,
      department: this.user.department,
    };
    this.spinner.show();
    this.applicationsService.getIssueList(requestObject).subscribe({
      next: (res) => {
        if (res.status) {
          this.issues = this.issueClassifier(res.data);
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
      },
    });
  }

  issueClassifier(data: any) { 
    let issues:any = {inbox:[], sent:[], draft:[]}   
    if(data?.length>0){
      data?.map((item:any)=>{
        console.log('ITEM==', item);
        if(item?.branchAction=='Draft' && item?.raisedBy==this.user.userId){
          item.subject=item?.title;
          item.time='Saved';
          issues.draft.push(item);
        }
        if(item?.branchAction=='Sent' && item?.raisedBy==this.user.userId){
          item.to='Municipal Secretary';
          item.subject=item?.title;
          item.time=item?.branchActionDate;
          issues.sent.push(item);
        }
        if(item?.branchAction=='Sent' && item?.raisedBy!=this.user.userId){
          item.from='Branch User';
          item.subject=item?.title;
          item.time=item?.createdAt;
          issues.inbox.push(item);
        }
      });
    }
    return issues;
  }

  submitIssue() {
    if (!this.issue.title) {
      this.toastr.warning('Issue title is mandatory', 'Warning Message');
      return;
    }
    if (!this.issue.ward) {
      this.toastr.warning('Ward is mandatory', 'Warning Message');
      return;
    }

    if (!this.issue.location) {
      this.toastr.warning('Location is mandatory', 'Warning Message');
      return;
    }

    if (!this.issue.description) {
      this.toastr.warning('Description is mandatory', 'Warning Message');
      return;
    }
    this.spinner.show();
    let requestObject: any = {
      title: this.issue.title,
      ward: this.issue.ward,
      location: this.issue.location,
      description: this.issue.description,
      department: this.user.department,
      userId: this.user.userId,
    };
    this.applicationsService.createIssue(requestObject).subscribe({
      next: (res) => {
        console.log('RES==', res);
        if (res?.status) {
          this.activeTab = 'draft';
          this.toastr.success(res.message, 'Success Message');          
        } else {
          this.toastr.error(res.message, 'Error Message');
        }
        this.spinner.hide();
        this.getIssueList();
        this.closePopup();
      },
      error: (err) => {
        this.toastr.error('Failed to save data', 'Error Message');
        this.spinner.hide();
      },
    });
  }

  selectedIssue:any={};
  onView(issue: any) {
    console.log(issue);
    this.selectedIssue = issue;
    this.isDetailView = true;
  }

  onBack(){
    this.isDetailView = false;
  }

  closePopup() {
    let ele: any = document.getElementById('issueModalClose');
    ele.click();
    this.resetForm();
  }

  resetForm() {
    this.issue = {
      title: '',
      ward: '',
      location: '',
      description: '',
    };
  }

  onSent(e:any){
    console.log("E==>",e);
    this.getIssueList();
    this.activeTab = 'sent';
  }
}
