import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { VotePageService } from './vote-page.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-vote-page',
  templateUrl: './vote-page.component.html',
  styleUrls: ['./vote-page.component.css'],
})
export class VotePageComponent implements OnInit {
  @Input() selectedIssue: any = null;
  issue: any = {};
  user: any = {};
  members: any = [];
  endpoint: any = '';
  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private votePageService: VotePageService
  ) {
    this.endpoint = environment.BASE_URL;
    this.user = {
      userId: this.authService.getUserId(),
      name: this.authService.getUserName(),
      email: this.authService.getEmail(),
      role: this.authService.getRole(),
      department: this.authService.getDepartment(),
    };
  }

  ngOnInit(): void {
    this.getIssueDetails();
    this.getVotePageData();
  }

  getVotePageData() {
    this.spinner.show();
    let requestObject: any = {
      issueId: this.selectedIssue.id,
      userId: this.user.userId,
    };
    this.votePageService.getVotePageData(requestObject).subscribe({
      next: (res) => {
        if (res.status) {
          this.members = res.data.members;
          this.issue.attachments = this.mapAttachments(res.data.attachments);
        } else {
          this.toastr.error(res.message, 'Error Message');
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
      },
    });
  }

  getIssueDetails() {
    this.issue = {
      title: this.selectedIssue?.title ?? '',
      description: this.selectedIssue?.description ?? '',
      attachments: [],
    };
  }

  mapAttachments(data: any) {
    let attachments: any = [];
    if (data?.length > 0) {
      data?.map((item: any) => {
        attachments.push({
          name: item?.doc_name,
          src: this.endpoint + '/docs/' + item?.doc_path,
        });
      });
    }
    return attachments;
  }

  castVote(member: any, decision: string) {
    this.spinner.show();
    let requestObject: any = {
      issueId: this.selectedIssue.id,
      userId: member.id,
      vote: decision,
    };
    this.votePageService.castVote(requestObject).subscribe({
      next: (res) => {
        if (res.status) {
          member.vote = decision;
        } else {
          this.toastr.error(res.message, 'Error Message');
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
      },
    });
  }

  get votedCount() {
    return this.members.filter((m: any) => m.vote !== null).length;
  }

  get result() {
    const approve = this.members.filter(
      (m: any) => m.vote === 'Approved'
    ).length;
    const reject = this.members.filter((m: any) => m.vote === 'Rejected').length;

    if (this.votedCount < this.members.length) {
      return 'Voting In Progress';
    }
    return approve > reject ? 'APPROVED' : 'REJECTED';
  }
}
