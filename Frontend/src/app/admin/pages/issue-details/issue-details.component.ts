import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssueDetailsService } from './issue-details.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ViewChild } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';

import Quill from 'quill';
import QuillMention from 'quill-mention';

Quill.register('modules/mention', QuillMention);




@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.css'],
})
export class IssueDetailsComponent implements OnInit {
  remarks: string = '';
  status: string = '';
  issueData: any[] = [];
  currentStatus: any = [];
  // issueData: any[] = [
  //   {
  //     id: "ISS-001",
  //     title: "Road Repair",
  //     ward: "05",
  //     submittedBy: "Ward Member - Amar Singh",
  //     date: "20 Nov 2025",
  //     location: "Near Ganeshguri Flyover, Guwahati",
  //     description: "Road is severely damaged and causing accidents. Immediate repair is required.",
  //     status: "In Process",
  //     statusColor: "warning",
  //     timeline: [
  //       { step: "Issue Submitted → Branch Office", date: "20 Nov 2025" },
  //       { step: "Forwarded to Department Secretary", date: "21 Nov 2025" },
  //       { step: "Sent to Municipal Secretary", date: "22 Nov 2025" },
  //       { step: "Forwarded to Commissioner", date: "23 Nov 2025" },
  //       { step: "Under MIC Review", date: "24 Nov 2025" }
  //     ],
  //     attachments: [
  //       { name: "Road Image 1", src: "https://via.placeholder.com/120" },
  //       { name: "Report.pdf", src: "https://via.placeholder.com/120" }
  //     ]
  //   },

  //   {
  //     id: "ISS-002",
  //     title: "Drainage Blockage",
  //     ward: "09",
  //     submittedBy: "Resident - Raju Das",
  //     date: "10 Oct 2025",
  //     location: "Beltola Tiniali",
  //     description: "Drainage system fully blocked causing waterlogging.",
  //     status: "Pending",
  //     statusColor: "secondary",
  //     timeline: [
  //       { step: "Issue Submitted", date: "10 Oct 2025" }
  //     ],
  //     attachments: [
  //       { name: "Drain Photo", src: "https://via.placeholder.com/120" }
  //     ]
  //   }
  // ];
  @Input() issue: any = null;
  @Input() activeTab: any = null;
  @Input() user: any = null;
  @Output() onSent = new EventEmitter<any>();
  @ViewChild('quillRef') quillEditor!: QuillEditorComponent;
  endpoint: any;
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private issueDetailsService: IssueDetailsService
  ) {
    this.endpoint = environment.BASE_URL;
  }

  ngOnInit(): void {
    console.log('issue', this.issue);
    console.log('active tab', this.activeTab);
    // this.issue.attachments = [
    //   { name: 'Road Image 1', src: 'https://via.placeholder.com/120' },
    //   { name: 'Report.pdf', src: 'https://via.placeholder.com/120' },
    // ];
    this.issue.timeline = this.getTimeLineStatus();
    this.getIssueAttachments();
    this.getAllComments();
  }

  getTimeLineStatus() {
    let timeline: any = [];
    if (this.issue) {
      if (this.issue.createdAt) {
        timeline.push({
          step: 'Agenda Drafted → Branch Office',
          date: this.issue.createdAt,
        });
      }
      if (this.issue.branchAction == 'Sent' && this.issue.branchActionDate) {
        timeline.push({
          step: 'Sent to Municipal Secretary',
          date: this.issue.branchActionDate,
        });
      }
      if (
        this.issue.municipalAction == 'Approved' &&
        this.issue.municipalActionDate
      ) {
        timeline.push({
          step: 'Sent to Commissioner by Municipal Secretary',
          date: this.issue.municipalActionDate,
        });
      }
      if (
        this.issue.municipalAction == 'Rejected' &&
        this.issue.municipalActionDate
      ) {
        timeline.push({
          step: 'Agenda Rejected by Municipal Secretary',
          date: this.issue.municipalActionDate,
        });
      }
      if (
        this.issue.commissionerAction == 'Approved' &&
        this.issue.commissionerActionDate
      ) {
        timeline.push({
          step: 'Sent to Mayor by Commissioner',
          date: this.issue.commissionerActionDate,
        });
      }
      if (
        this.issue.commissionerAction == 'Rejected' &&
        this.issue.commissionerActionDate
      ) {
        timeline.push({
          step: 'Agenda Rejected by Commissioner',
          date: this.issue.commissionerActionDate,
        });
      }
      if (this.issue.mayorAction == 'Approved' && this.issue.mayorActionDate) {
        timeline.push({
          step: 'Approved by Mayor for MIC Review',
          date: this.issue.mayorActionDate,
        });
      }
      if (this.issue.mayorAction == 'Rejected' && this.issue.mayorActionDate) {
        timeline.push({
          step: 'Agenda Rejected by Mayor',
          date: this.issue.mayorActionDate,
        });
      }
      if (this.issue.voting == 'Started' && this.issue.votingDate) {
        timeline.push({
          step: 'Placed in MIC Meeting',
          date: this.issue.votingDate,
        });
      }
      if (this.issue.voting == 'Completed' && this.issue.votingDate) {
        timeline.push({
          step: 'MIC Meeting Completed',
          date: this.issue.votingDate,
        });
      }
      if (this.issue.status == 'Pending' && this.issue.votingDate) {
        timeline.push({
          step: 'Agenda Acceptance Pending',
          date: this.issue.votingDate,
        });
      }
      if (this.issue.status == 'Accepted' && this.issue.votingDate) {
        timeline.push({ step: 'Agenda Accepted', date: this.issue.votingDate });
      }
      if (this.issue.status == 'Rejected' && this.issue.votingDate) {
        timeline.push({ step: 'Agenda Rejected', date: this.issue.votingDate });
      }
    }
    return timeline;
  }

  issueAttachments: any = [];
  getIssueAttachments() {
    this.spinner.show();
    let requestObject: any = {
      issueId: this.issue.id,
    };
    this.issueDetailsService.getIssueAttachments(requestObject).subscribe({
      next: (res) => {
        if (res.status) {
          this.issueAttachments = res.data;
          this.issue.attachments = this.mapAttachments(res.data);
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

  confirmMe(role: any) {
    let confMsg: any = 'Are you sure?';
    switch (role) {
      case 'branch_user':
        confMsg = 'Sending it to Municipal Secretary. Is that okay?';
        break;
      case 'municipal_secretary':
        confMsg = 'Sending it to Commissioner. Is that okay?';
        break;
      case 'commissioner':
        confMsg = 'Sending it to Mayor. Is that okay?';
        break;
      case 'mayor':
        confMsg = 'Approving it to select for MIC meeting. Is that okay?';
        break;
    }
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
        this.submitIssue();
      }
    });
  }

  deferredMe(role: any) {
    let confMsg: any = 'Are you sure?';
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
        this.deferredIssue();
      }
    });
  }

  deferredIssue() {
    let requestObject: any = {
      user: this.user,
      issue: this.issue,
    };
    this.spinner.show();
    this.issueDetailsService.deferredIssue(requestObject).subscribe({
      next: (res) => {
        if (res.status) {
          this.toastr.success(res.message, 'Success Message');
          this.onSent.emit('IssueSentToMunicipalSecretary');
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

  submitIssue() {
    let requestObject: any = {
      user: this.user,
      issue: this.issue,
      action: {
        status: 'Positive',
        remarks: '',
      },
    };
    this.spinner.show();
    this.issueDetailsService.updateIssue(requestObject).subscribe({
      next: (res) => {
        if (res.status) {
          this.toastr.success(res.message, 'Success Message');
          this.onSent.emit('IssueSentToMunicipalSecretary');
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

  rejectionReason: any = '';
  rejectMe() {
    if (!this.rejectionReason) {
      this.toastr.warning(
        'Please specify reason for rejection as it is mandatory',
        'Success Message'
      );
      return;
    }
    let requestObject: any = {
      user: this.user,
      issue: this.issue,
      action: {
        status: 'Negative',
        remarks: this.rejectionReason,
      },
    };
    this.spinner.show();
    this.issueDetailsService.updateIssue(requestObject).subscribe({
      next: (res) => {
        if (res.status) {
          this.toastr.success(res.message, 'Success Message');
          this.onSent.emit('IssueSentToMunicipalSecretary');
          let ele: any = document.getElementById('issueRejectModalClose');
          ele.click();
          this.rejectionReason = '';
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.toastr.warning('File size must be under 5MB', 'Warning Message');
      return;
    }
    const formData = new FormData();
    formData.append('issue', JSON.stringify(this.issue));
    formData.append('user', JSON.stringify(this.user));
    formData.append('file', file);
    this.issueDetailsService.uploadIssueAttachment(formData).subscribe({
      next: (res) => {
        if (res.status) {
          this.toastr.success(res.message, 'Success Message');
          this.getIssueAttachments();
        } else {
          this.toastr.error(res.message, 'Error Message');
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.toastr.error(
          'Oops! something went wrong. Please try again',
          'Error Message'
        );
        this.spinner.hide();
      },
    });
  }

  commentText: string = '';

  sendComment() {
    if (!this.commentText.trim()) return;

    console.log('Comment==>:', this.commentText);
    console.log('root_id==>', this.selectedComment.id);
    let root_id = this.selectedComment?.id || null;
    // TODO: API call here
    console.log('JSON.stringify(this.user) ', this.user);
    let requestObject: any = {
      user: this.user,
      issue: this.issue,
      comment: this.commentText,
      root_id: root_id || null,
    };

    console.log('requestObject ', requestObject);
    // return;

    this.issueDetailsService.addComment(requestObject).subscribe({
      next: (res) => {
        if (res.status) {
          this.toastr.success(res.message, 'Success Message');
          // this.getIssueComments();
          this.getAllComments();
        } else {
          this.toastr.error(res.message, 'Error Message');
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
      },
    });

    this.commentText = '';
  }

  allComments: any[] = [];

  getAllComments() {
    let requestObject: any = {
      issue: this.issue,
      user: this.user,
    };
    this.issueDetailsService.getAllComments(requestObject).subscribe({
      next: (res) => {
        if (res.status) {
          this.allComments = res.data;
          this.prepareMentionUsers();
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

  mentionUsers: any[] = [];

prepareMentionUsers() {
  const usersMap = new Map();

  this.allComments.forEach(comment => {
    usersMap.set(comment.commentBy, {
      id: comment.commentBy,
      value: comment.commentByName
    });

    comment.replies?.forEach((reply: any) => {
      usersMap.set(reply.commentBy, {
        id: reply.commentBy,
        value: reply.commentByName
      });
    });
  });

  this.mentionUsers = Array.from(usersMap.values());
}


  startVoting() {
    let confMsg: any = 'Are you sure! You want start meeting?';
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
        this.updateVotingStatus();
      }
    });
  }

  updateVotingStatus() {
    let requestObject: any = {
      user: this.user,
      issue: this.issue,
    };
    this.spinner.show();
    this.issueDetailsService.updateVotingStatus(requestObject).subscribe({
      next: (res) => {
        if (res.status) {
          this.toastr.success(res.message, 'Success Message');
          this.onSent.emit('VotingStarted');
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

  agents = [ { id: 1, value: 'Sofi Salman' }, { id: 2, value: 'John Smith' }, { id: 3, value: 'Riya Sharma' } ];

  editorModules = {
    toolbar: false,
    mention: {
      mentionDenotationChars: ['@'],
      allowedChars: /^[A-Za-z\s]*$/,
      source: (searchTerm: string, renderList: any) => {
        const values = this.mentionUsers;
  
        if (!searchTerm.length) {
          renderList(values, searchTerm);
        } else {
          const matches = values.filter(item =>
            item.value.toLowerCase().includes(searchTerm.toLowerCase())
          );
          renderList(matches, searchTerm);
        }
      }
    }
  };
  

  selectedComment: any;

  replyComment(comment: any) {
    // this.replyToComment = comment;
    console.log('comment ', comment);

    this.selectedComment = comment; //add root id
    let content = this.commentText?.replace('<p>', '').replace('</p>', '');
    let tag = comment.commentByName;

    // this.commentText =
    //   content +
    //   '<span class="reply-to" style="color: #0000ff;">' +
    //   '@' +
    //   tag +
    //   '</span>' +
    //   ' ';

    this.commentText = content;

    setTimeout(() => {
      const editor = this.quillEditor.quillEditor;
      editor.focus();
      editor.setSelection(editor.getLength(), 0);
    }, 0);
  }



  manageComment(e: any, comment: any) {
    console.log("e ", e);
    this.selectedComment = comment || null;
    // this.commentText = comment?.comment || null;
  }

  
}
