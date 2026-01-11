import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/auth.service';
import { VotingZoneService } from './voting-zone.service';
import Swal from 'sweetalert2';

type MailType = 'inbox' | 'sent' | 'draft';

@Component({
  selector: 'app-voting-zone',
  templateUrl: './voting-zone.component.html',
  styleUrls: ['./voting-zone.component.css'],
})
export class VotingZoneComponent {
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
    private votingZoneService: VotingZoneService
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
    this.votingZoneService.getVotingReadyIssueList(requestObject).subscribe({
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
      data?.map((item: any) => {
        item.from =
          item?.raisedByName + '(' + item?.department + ' Department)';
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

  // stopVoting() {
  //   this.spinner.show();
  //   let requestObject: any = {
  //     issueId: this.selectedIssue.id,
  //     userId: this.user.userId,
  //     role: this.user.role,
  //   };
  //   this.votingZoneService.stopVoting(requestObject).subscribe({
  //     next: (res) => {
  //       if (res.status) {
  //         this.toastr.success(res.message, 'Success Message');
  //         location.reload();
  //       } else {
  //         this.toastr.error(res.message, 'Error Message');
  //       }
  //       this.spinner.hide();
  //     },
  //     error: (err) => {
  //       this.spinner.hide();
  //     },
  //   });
  // }

  startVoting() {
      let confMsg: any = 'Are you sure! You want start voting?';
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
      if (this.issues.inbox.length > 0) {
        const ids = this.issues.inbox.map((ele: any) => ele.id).join(', ');      
        let requestObject: any = {
          meeting: this.getMeetingId(),
          issues: ids,
          meetingDate: new Date(),
          status: 'Active',
          isDeleted: false,
        };
        this.spinner.show();
        this.votingZoneService
          .updateStartVotingStatus(requestObject)
          .subscribe({
            next: (res) => {
              if (res.status) {
                this.toastr.success(res.message, 'Success Message');
                location.reload();
                this.activeTab = 'inbox';
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
      if (this.issues.inbox.length > 0) {
        const ids = this.issues.inbox.map((ele: any) => ele.id).join(', ');
        this.spinner.show();
        let requestObject: any = {
          issues: ids,
          userId: this.user.userId,
          role: this.user.role,
        };
        this.votingZoneService
          .updateStopVotingStatus(requestObject)
          .subscribe({
            next: (res) => {
              if (res.status) {
                this.toastr.success(res.message, 'Success Message');
                location.reload();
                this.activeTab = 'inbox';
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
