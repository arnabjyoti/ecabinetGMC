import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/auth.service';
import { VotingZoneService } from './voting-zone.service';

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

  issueClassifier(data: any) {
    let issues: any = { inbox: [], sent: [], draft: [] };
    if (data?.length > 0) {
      data?.map((item: any) => {
        console.log('ITEM==', item);
        item.from = 'Branch User';
        item.subject = item?.title;
        item.time = item?.createdAt;
        issues.inbox.push(item);
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
    this.getVotingReadyIssueList();
    this.activeTab = 'inbox';
    this.isDetailView = false;
  }

  onSidebarToggle(val: boolean) {
    this.sidebarCollapsed = val;
  }
}
