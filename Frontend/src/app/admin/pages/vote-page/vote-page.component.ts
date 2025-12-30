import { Component, Input, OnInit } from '@angular/core';
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
  members = [
    { id: 1, name: 'Chief Secretary', vote: null },
    { id: 2, name: 'Finance Secretary', vote: null },
    { id: 3, name: 'Transport Secretary', vote: null },
    { id: 4, name: 'Law Secretary', vote: null },
    { id: 5, name: 'Power Secretary', vote: null },
    { id: 6, name: 'Planning Secretary', vote: null },
    { id: 7, name: 'Environment Secretary', vote: null },
    { id: 8, name: 'Urban Development Secretary', vote: null },
    { id: 9, name: 'IT Secretary', vote: null },
  ];
endpoint:any='';
  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private votePageService: VotePageService
  ) {
    this.endpoint = environment.BASE_URL;
  }

  ngOnInit(): void {
    this.getIssueDetails();
    this.getIssueAttachments();
  }

  getIssueDetails() {
    this.issue = {
      title: this.selectedIssue?.title ?? '',
      description: this.selectedIssue?.description ?? '',
      attachments: [],
      //   attachments: [
      //     { name: 'Cabinet_Note.pdf' },
      //     { name: 'Financial_Implication.xlsx' },
      //   ],
    };
  }

  getIssueAttachments() {
    this.spinner.show();
    let requestObject: any = {
      issueId: this.selectedIssue.id,
    };
    this.votePageService.getIssueAttachments(requestObject).subscribe({
      next: (res) => {
        if (res.status) {
          this.issue.attachments = this.mapAttachments(res.data);
          console.log("ISSUE==",this.issue);
          
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
    member.vote = decision;
  }

  get votedCount() {
    return this.members.filter((m) => m.vote !== null).length;
  }

  get result() {
    const approve = this.members.filter((m) => m.vote === 'Approve').length;
    const reject = this.members.filter((m) => m.vote === 'Reject').length;

    if (this.votedCount < this.members.length) {
      return 'Voting In Progress';
    }
    return approve > reject ? 'APPROVED' : 'REJECTED';
  }
}
