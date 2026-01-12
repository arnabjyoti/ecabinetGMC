import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { MayorIssueBucketService } from './mayor-issue-bucket.service';
import Swal from 'sweetalert2';

type MailType = 'inbox' | 'sent' | 'draft';

@Component({
  selector: 'app-mayor-issue-bucket',
  templateUrl: './mayor-issue-bucket.component.html',
  styleUrls: ['./mayor-issue-bucket.component.css']
})
export class MayorIssueBucketComponent implements OnInit{
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
    private mayorIssueBucketService: MayorIssueBucketService
  ) {
    this.user = {
      userId: this.authService.getUserId(),
      name: this.authService.getUserName(),
      email: this.authService.getEmail(),
      role: this.authService.getRole(),
      department: this.authService.getDepartment(),
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
    this.mayorIssueBucketService.getIssueList(requestObject).subscribe({
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
      let count:any={
        inbox:0,
        sent:0
      }
      data?.map((item: any) => {
        if (
          item?.branchAction == 'Sent' &&
          item?.municipalAction == 'Approved' &&
          item?.commissionerAction == 'Approved' &&
          (item?.mayorAction == '' || item?.mayorAction == null)
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
          item?.commissionerAction == 'Approved' && 
          item?.mayorAction == 'Approved'
        ) {
          count.sent++;
          item.serial = count.sent;
          item.from =
            item?.raisedByName + '(' + item?.department + ' Department)';
          item.subject = item?.title;
          item.time = item?.createdAt;
          issues.sent.push(item);
          if (item?.voting != 'Started') {
            this.isVotingStarted = false;
          }
        }
      });
    }
    return issues;
  }

  selectedIssue: any = {};
  onView(issue: any) {
    console.log(issue);
    this.selectedIssue = issue;
    this.isDetailView = true;
  }

  onBack() {
    this.isDetailView = false;
  }

  onSent(e: any) {
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

  startVoting() {
    let confMsg: any = 'Are you sure! You want to place agendas in the MIC meeting?';
    Swal.fire({
      title: 'Confirmation Message',
      text: confMsg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateStartVotingStatus();
      }
    });
  }

  getMeetingId() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const year = now.getFullYear();
    const random4Digit = Math.floor(1000 + Math.random() * 9000);
    const uniqueId = `MIC${day}${month}${year}${random4Digit}`;
    return uniqueId;
  }
  updateStartVotingStatus() {
    if (this.issues.sent.length > 0) {
      const ids = this.issues.sent.map((ele: any) => ele.id).join(', ');      
      let requestObject: any = {
        meeting: this.getMeetingId(),
        issues: ids,
        meetingDate: new Date(),
        status: 'Active',
        isDeleted: false,
      };
      this.spinner.show();
      this.mayorIssueBucketService
        .updateStartVotingStatus(requestObject)
        .subscribe({
          next: (res) => {
            if (res.status) {
              this.toastr.success(res.message, 'Success Message');
              location.reload();
              this.activeTab = 'sent';
            } else {
              this.toastr.error(res.message, 'Error Message');
            }
            this.spinner.hide();
          },
          error: (err) => {
            this.spinner.hide();
          },
        });
    } else {
      this.toastr.warning('No issues found', 'Warning Message');
    }
  }

  stopVoting() {
    let confMsg: any = 'Are you sure! You want stop voting?';
    Swal.fire({
      title: 'Confirmation Message',
      text: confMsg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateStopVotingStatus();
      }
    });
  }

  updateStopVotingStatus() {
    if (this.issues.sent.length > 0) {
      const ids = this.issues.sent.map((ele: any) => ele.id).join(', ');
      this.spinner.show();
      let requestObject: any = {
        issues: ids,
        userId: this.user.userId,
        role: this.user.role,
      };
      this.mayorIssueBucketService
        .updateStopVotingStatus(requestObject)
        .subscribe({
          next: (res) => {
            if (res.status) {
              this.toastr.success(res.message, 'Success Message');
              location.reload();
              this.activeTab = 'sent';
            } else {
              this.toastr.error(res.message, 'Error Message');
            }
            this.spinner.hide();
          },
          error: (err) => {
            this.spinner.hide();
          },
        });
    } else {
      this.toastr.warning('No issues found', 'Warning Message');
    }
  }
}
