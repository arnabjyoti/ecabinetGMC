import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.css'],
})
export class IssueDetailsComponent implements OnInit {
  issue: any = null;
  remarks: string = '';
  status: string = '';

  // Local JSON — will be replaced by API later

  issueData: any[] = [];
  user: any = null;
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

  constructor(private route: ActivatedRoute) {
    let u = localStorage.getItem('issueList');
    let user = localStorage.getItem('user');
    this.user = JSON.parse(user || '{}');
    this.issueData = JSON.parse(u || '[]');
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('iddddddddd', id);

    this.issue = this.issueData.find((x) => x.id === id);
    this.currentStatus = this.issue.status[0].status;
    // this.issue = JSON.parse(JSON.stringify(this.issue));
    console.log('issue', this.issue);
  }

  submitIssue() {
    console.log('remarks: ', this.remarks);
    console.log('status: ', this.status);

    console.log("user ", this.user);
    

    const id = this.user.id;

    // console.log("issue ==>>", this.issue);
    

    const newStatus = {
      status: this.status,
      date: new Date().toISOString(),
      role: this.user.role,
      branch_name: this.user.branch_name,
      remarks: this.remarks
    };

    const updatedList = this.issueData.map((item) => {
      if (item.id == this.issue.id) {
        // Find matching status entry
        const index = item.status.findIndex(
          (s: any) => s.role === this.user.role && s.branch_name === this.user.branch_name
        );
        // console.log("indexindex ", index);
        // console.log("itemitemitem ", item);

        if (index !== -1) {
          // Update existing status
          item.status[index].status = newStatus.status;
          item.status[index].date = newStatus.date;
          item.status[index].remarks = newStatus.remarks;
        } else {
          // Add a new status entry
          item.status.push(newStatus);
        }

        // console.log("item.status ", item);
        
      }

      return item;
    });

    console.log(updatedList);

    this.issueData = updatedList;
    localStorage.setItem('issueList', JSON.stringify(updatedList));
    this.currentStatus = newStatus.status;
  }
}
