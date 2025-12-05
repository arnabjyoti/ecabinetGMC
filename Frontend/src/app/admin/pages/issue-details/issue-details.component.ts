import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.css']
})
export class IssueDetailsComponent implements OnInit {

  issue: any = null;

  // Local JSON — will be replaced by API later
  issueData: any[] = [
    {
      id: "ISS-001",
      title: "Road Repair",
      ward: "05",
      submittedBy: "Ward Member - Amar Singh",
      date: "20 Nov 2025",
      location: "Near Ganeshguri Flyover, Guwahati",
      description: "Road is severely damaged and causing accidents. Immediate repair is required.",
      status: "In Process",
      statusColor: "warning",
      timeline: [
        { step: "Issue Submitted → Branch Office", date: "20 Nov 2025" },
        { step: "Forwarded to Department Secretary", date: "21 Nov 2025" },
        { step: "Sent to Municipal Secretary", date: "22 Nov 2025" },
        { step: "Forwarded to Commissioner", date: "23 Nov 2025" },
        { step: "Under MIC Review", date: "24 Nov 2025" }
      ],
      attachments: [
        { name: "Road Image 1", src: "https://via.placeholder.com/120" },
        { name: "Report.pdf", src: "https://via.placeholder.com/120" }
      ]
    },

    {
      id: "ISS-002",
      title: "Drainage Blockage",
      ward: "09",
      submittedBy: "Resident - Raju Das",
      date: "10 Oct 2025",
      location: "Beltola Tiniali",
      description: "Drainage system fully blocked causing waterlogging.",
      status: "Pending",
      statusColor: "secondary",
      timeline: [
        { step: "Issue Submitted", date: "10 Oct 2025" }
      ],
      attachments: [
        { name: "Drain Photo", src: "https://via.placeholder.com/120" }
      ]
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.issue = this.issueData.find(x => x.id === id);
  }

}
