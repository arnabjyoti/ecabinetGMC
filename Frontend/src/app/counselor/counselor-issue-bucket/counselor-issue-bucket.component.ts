import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { CounselorIssueBucketService } from './counselor-issue-bucket.service';
import Swal from 'sweetalert2';

type MailType = 'inbox' | 'sent' | 'draft';

@Component({
  selector: 'app-counselor-issue-bucket',
  templateUrl: './counselor-issue-bucket.component.html',
  styleUrls: ['./counselor-issue-bucket.component.css'],
})
export class CounselorIssueBucketComponent implements OnInit {
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
      private toastr: ToastrService,
      private spinner: NgxSpinnerService,
      private authService: AuthService,
      private counselorIssueBucketService: CounselorIssueBucketService
    ) {
      this.user = {
        userId: this.authService.getUserId(),
        email: this.authService.getEmail(),
        role: this.authService.getRole(),
        department: this.authService.getDepartment(),
      };
    }
    ngOnInit(): void {
      this.getVotingReadyIssueList();
    }
  
    getVotingReadyIssueList() {
      let requestObject: any = {
        role: this.user.role,
        department: this.user.department,
      };
      this.spinner.show();
      this.counselorIssueBucketService.getVotingReadyIssueList(requestObject).subscribe({
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
  
    isVotingStarted: boolean = true;
    issueClassifier(data: any) {
      let issues: any = { inbox: [], sent: [], draft: [] };
      if (data?.length > 0) {
        let serial:any=0;
        data?.map((item: any) => {
          serial++;
          item.serial=serial;
          item.from = item?.raisedByName + '(' + item?.department + ' Department)';
          item.subject = item?.title;
          item.time = item?.createdAt;
          issues.inbox.push(item);
          if (item?.voting != 'Started') {
            this.isVotingStarted = false;
          }
        });
      }
      return issues;
    }
  
    selectedIssue: any = {};
    onView(issue: any) {
      this.selectedIssue = issue;
      this.isDetailView = true;
    }
  
    onBack() {
      this.isDetailView = false;
    }
  
    onSent(e: any) {
      this.getVotingReadyIssueList();
      this.activeTab = 'inbox';
      this.isDetailView = false;
    }
  
    onSidebarToggle(val: boolean) {
      this.sidebarCollapsed = val;
    }
}
