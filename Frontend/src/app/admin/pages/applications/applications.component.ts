import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import issues from 'src/assets/dummy/issues.json';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css'],
})
export class ApplicationsComponent implements OnInit {
  @Output() saveIssue = new EventEmitter<any>();

  ngOnInit(): void {
    // this.issueList = issues;
    // localStorage.setItem('issueList', JSON.stringify(this.issueList));
    this.getIssueList();
  }

  getIssueList() {
    const issueList = localStorage.getItem('issueList');
    
    if (issueList) {
      this.issueList = JSON.parse(issueList);
      console.log("issueList: ", this.issueList);
      

      const filteredIssues = this.issueList.filter((issue: any) => {
        console.log("branch ", this.user.role);
        
        if (this.user.role === 'branch') {
          return issue.branch_name === this.user.branch_name;
        }
        return issue; // include everything else
      });
      // console.log("filteredIssues ", this.issueList);
      
      this.tableData = filteredIssues.map((issue: any) => {
        return {
          id: issue.id,
          title: issue.title,
          ward: issue.ward,
          // status: (issue.status && issue?.status?.length > 0) && console.log("=>", issue.status && Array.isArray(issue?.status) ? issue?.status.map((e:any)=> e.role === this.user.role && e.branch_name === this.user.branch_name ? e.status : 'In Process') : 'no' ),
          
          status: this.getStatus(issue),
          // status: issue?.status?.map((e:any)=> e.role === this.user.role && e.branch_name === this.user.branch_name ? e.status : 'In Process'),
          date: issue.date,
        };
      });

      console.log("tableData ", this.tableData);
      
    }
  }

  getStatus(data:any){
    const result = data && Array.isArray(data?.status)
  ? data.status.find((e: any) =>
      e.role === this.user.role &&
      e.branch_name === this.user.branch_name
    )?.status || 'In Process'
  : 'In Process';
    console.log("result ", result);
    
    return result;
  }

  tableData:any;

  sidebarCollapsed = false;

  // 🔥 Popup visibility
  showPopup = false;

  // 🔥 Issue model for NG-MODEL
  issue = {
    title: '',
    id: '',
    ward: '',
    submittedBy: '',
    date: '',
    location: '',
    description: '',
    // status: 'In Process',
    status : 'In Process',
    timeline: [] as any[],
    attachments: [] as File[],
    role: '',
    branch_name: ''
  };

  selectedFiles: File[] = [];

  constructor(private router: Router) {
    let u = localStorage.getItem('user');
    this.user = JSON.parse(u || '{}');
  }

  columns = [
    { field: 'id', header: 'ID' },
    { field: 'title', header: 'Issue Title' },
    { field: 'ward', header: 'Ward No.' },
    { field: 'status', header: 'Status' },
    { field: 'date', header: 'Date' },
  ];

  issueList:any = [];

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
      title: '',
      id: '',
      ward: '',
      submittedBy: '',
      date: '',
      location: '',
      description: '',
      status: 'In Process',
      timeline: [],
      attachments: [],
      role: '',
      branch_name: ''
    };
    this.selectedFiles = [];
  }

  // 📁 File Select Handler
  onFileSelect(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    this.issue.attachments = this.selectedFiles;
  }

  user:any;

  // 💾 SAVE ISSUE
  submitIssue() {
     

    if (this.user) {
      this.issue.role = this.user.role;
      this.issue.branch_name = this.user.branch_name;
    }
    
    if (!this.issue.id || !this.issue.title) {
      alert('Issue ID & Title are required!');
      return;
    }

    this.issueList.unshift({
      id: this.issue.id,
      title: this.issue.title,
      ward: this.issue.ward,
      // status: this.issue.status,
      status : [
        {
          status: this.issue.status,
          date: this.issue.date,
          role: this.issue.role,
          branch_name: this.issue.branch_name
        }
      ],
      date: this.issue.date,
      
      role: this.issue.role,
      branch_name: this.issue.branch_name
    });

    this.saveIssue.emit(this.issue);
    console.log('issueList : ', this.issueList);
    localStorage.setItem('issueList', JSON.stringify(this.issueList));

    // sessionStorage.setItem('user', JSON.stringify(found));
    this.getIssueList();

    this.closePopup();
  }
}
