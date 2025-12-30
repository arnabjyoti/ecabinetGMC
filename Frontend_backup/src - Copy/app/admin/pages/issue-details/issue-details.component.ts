import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssueDetailsService } from './issue-details.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.css'],
})
export class IssueDetailsComponent implements OnInit {
  // issue: any = null;
  remarks: string = '';
  status: string = '';

  // Local JSON — will be replaced by API later

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
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private issueDetailsService: IssueDetailsService
  ) {
  }

  ngOnInit(): void {
    console.log('issue', this.issue);
    console.log('active tab', this.activeTab);
    this.issue.attachments = [
      { name: 'Road Image 1', src: 'https://via.placeholder.com/120' },
      { name: 'Report.pdf', src: 'https://via.placeholder.com/120' },
    ];
  }

  confirmMe() {
    Swal.fire({
      title: 'Confirmation Message',
      text: `Sending it to Municipal Secretary. Is that okay?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('ISSUE= ', this.issue);
        console.log('USER= ', this.user);
        this.submitIssue();
      }
    });
  }

  submitIssue() {
    let requestObject: any = {
      user: this.user,
      issue: this.issue,
    };
    this.spinner.show();
    this.issueDetailsService.updateIssue(requestObject).subscribe({
      next: (res) => {
        if (res.status) {
          this.toastr.success(
            res.message,
            'Success Message'
          );
          this.onSent.emit('IssueSentToMunicipalSecretary');
        } else {
          this.toastr.error(
            res.message,
            'Error Message'
          );
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
      },
    });    
  }

  commentText: string = '';

  sendComment() {
    if (!this.commentText.trim()) return;

    console.log('Comment:', this.commentText);

    // TODO: API call here

    this.commentText = '';
  }
}
