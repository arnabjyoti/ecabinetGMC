import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { MuniSecIssueBucketService } from './muni-sec-issue-bucket.service';

type MailType = 'inbox' | 'sent' | 'draft';

@Component({
  selector: 'app-muni-sec-issue-bucket',
  templateUrl: './muni-sec-issue-bucket.component.html',
  styleUrls: ['./muni-sec-issue-bucket.component.css'],
})
export class MuniSecIssueBucketComponent implements OnInit {
  sidebarCollapsed = false;
  isDetailView: boolean = false;
  issues: any = {
    inbox: [],
    sent: [],
    draft: [],
  };
  activeTab: MailType = 'inbox';
  user: any = '';
  constructor(
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private muniSecIssueBucketService: MuniSecIssueBucketService
  ) {
    this.user = {
      userId: this.authService.getUserId(),
      name: this.authService.getUserName(),
      email: this.authService.getEmail(),
      role: this.authService.getRole(),
      department: this.authService.getDepartment()
    };
  }
  ngOnInit(): void {
    this.getIssueList();
  }

  getIssueList() {
    let requestObject: any = {
      role: this.user.role,
      department: this.user.department,
    };
    this.spinner.show();
    this.muniSecIssueBucketService.getIssueList(requestObject).subscribe({
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
      // data?.map((item:any)=>{
      //   if(item?.branchAction=='Draft' && item?.raisedBy==this.user.userId){
      //     item.subject=item?.title;
      //     item.time='Saved';
      //     issues.draft.push(item);
      //   }
      //   if(item?.branchAction=='Sent' && item?.raisedBy==this.user.userId){
      //     item.to='Municipal Secretary';
      //     item.subject=item?.title;
      //     item.time=item?.branchActionDate;
      //     issues.sent.push(item);
      //   }
      //   if(item?.branchAction=='Sent' && item?.raisedBy!=this.user.userId){
      //     item.from= item?.raisedByName+'('+item?.department+' Department)';
      //     item.subject=item?.title;
      //     item.time=item?.createdAt;
      //     issues.inbox.push(item);
      //   }
      // });
      let count:any={
        inbox:0,
        sent:0
      }
      data?.map((item: any) => {
        if (
          item?.branchAction == 'Sent' &&
          item?.municipalAction == '' &&
          item?.commissionerAction == ''
        ) {
          count.inbox++;
          item.serial = count.inbox;
          item.from =
            item?.raisedByName + '(' + item?.department + ' Department)';
          item.subject = item?.title;
          item.time = item?.createdAt;
          issues.inbox.push(item);
        }
        if (
          item?.branchAction == 'Sent' &&
          item?.municipalAction == 'Approved' &&
          item?.commissionerAction == ''
        ) {
          count.sent++;
          item.serial = count.sent;
          item.from =
            item?.raisedByName + '(' + item?.department + ' Department)';
          item.subject = item?.title;
          item.time = item?.createdAt;
          issues.sent.push(item);
        }
      });
    }
    return issues;
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

  onSent(e:any){
    this.getIssueList();
    this.activeTab = 'inbox';
    this.isDetailView = false;
  }

  onSidebarToggle(val: boolean) {
    this.sidebarCollapsed = val;
  }

   selectTab(tab: MailType) {
    this.activeTab = tab;
    this.isDetailView = false;
  }
}
