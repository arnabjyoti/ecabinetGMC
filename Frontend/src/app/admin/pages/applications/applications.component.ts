import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent {

  @Output() saveIssue = new EventEmitter<any>();

  sidebarCollapsed = false;

  // 🔥 Popup visibility
  showPopup = false;

  // 🔥 Issue model for NG-MODEL
  issue = {
    title: "",
    id: "",
    ward: "",
    submittedBy: "",
    date: "",
    location: "",
    description: "",
    status: "In Process",
    timeline: [] as any[],
    attachments: [] as File[]
  };

  selectedFiles: File[] = [];

  constructor(private router: Router) { }

  columns = [
    { field: 'id', header: 'ID' },
    { field: 'title', header: 'Issue Title' },
    { field: 'ward', header: 'Ward No.' },
    { field: 'status', header: 'Status' },
    { field: 'date', header: 'Date' }
  ];

  issueList = [
    { id: 'ISS-001', title: 'Road Repair', ward: '05', status: 'In-Process', date: '20 Nov 2025' },
    { id: 'ISS-002', title: 'Drainage Block', ward: '11', status: 'Approved', date: '21 Nov 2025' },
    { id: 'ISS-003', title: 'Street Light Not Working', ward: '03', status: 'Rejected', date: '18 Nov 2025' },
    { id: 'ISS-004', title: 'Garbage Overflow', ward: '07', status: 'Approved', date: '19 Nov 2025' },
    { id: 'ISS-005', title: 'Water Leakage', ward: '04', status: 'In-Process', date: '17 Nov 2025' },
    { id: 'ISS-006', title: 'Tree Fallen', ward: '12', status: 'Rejected', date: '15 Nov 2025' },
    { id: 'ISS-007', title: 'Footpath Broken', ward: '02', status: 'Approved', date: '14 Nov 2025' },
    { id: 'ISS-008', title: 'Transformer Issue', ward: '08', status: 'In-Process', date: '12 Nov 2025' },
    { id: 'ISS-009', title: 'Public Toilet Maintenance', ward: '10', status: 'Rejected', date: '10 Nov 2025' },
    { id: 'ISS-010', title: 'Sewer Cleaning Required', ward: '06', status: 'Approved', date: '08 Nov 2025' }
  ];

  onSidebarToggle(val: boolean) {
    this.sidebarCollapsed = val;
  }

  onView(row: any) {
    this.router.navigate(['/issue-details', row.id]);
  }

  // 🔥 OPEN POPUP
  openAddIssue() {
    this.resetForm();
    this.showPopup = true;
  }

  // ❌ CLOSE POPUP
  closePopup() {
    this.showPopup = false;
  }

  // 🔄 RESET FORM FIELDS
  resetForm() {
    this.issue = {
      title: "",
      id: "",
      ward: "",
      submittedBy: "",
      date: "",
      location: "",
      description: "",
      status: "In Process",
      timeline: [],
      attachments: []
    };
    this.selectedFiles = [];
  }

  // 📁 File Select Handler
  onFileSelect(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    this.issue.attachments = this.selectedFiles;
  }

  // 💾 SAVE ISSUE
  submitIssue() {
    if (!this.issue.id || !this.issue.title) {
      alert("Issue ID & Title are required!");
      return;
    }

    this.issueList.unshift({
      id: this.issue.id,
      title: this.issue.title,
      ward: this.issue.ward,
      status: this.issue.status,
      date: this.issue.date
    });

    this.saveIssue.emit(this.issue);

    this.closePopup();
  }
}
