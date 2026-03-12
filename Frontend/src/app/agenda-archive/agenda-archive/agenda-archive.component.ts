import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { AgendaArchiveService } from './agenda-archive.service';

type MailType = 'inbox' | 'sent' | 'draft';

@Component({
  selector: 'app-agenda-archive',
  templateUrl: './agenda-archive.component.html',
  styleUrls: ['./agenda-archive.component.css'],
})
export class AgendaArchiveComponent {
  sidebarCollapsed = false;
  isDetailView: boolean = false;
  agendas: any = {
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
    private agendaArchiveService:AgendaArchiveService
  ) {
    this.user = {
      userId: this.authService.getUserId(),
      email: this.authService.getEmail(),
      role: this.authService.getRole(),
      department: this.authService.getDepartment(),
    };
  }
  ngOnInit(): void {
    this.getArchiveMeetings();
  }

  onSidebarToggle(val: boolean) {
    this.sidebarCollapsed = val;
  }

  meetings:any = [];  
  getArchiveMeetings() {
    let requestObject: any = {
      role: this.user.role
    };
    this.spinner.show();
    this.agendaArchiveService.getArchiveMeetings(requestObject).subscribe({
      next: (res) => {
        if (res.status) {
          this.meetings = res.data;
          console.log("Meetings===", this.meetings);
          if(this.meetings?.length>0){
            this.selectedMeeting = this.meetings[0].meeting;
            this.getArchiveAgendas(this.meetings[0]?.issues);
          }else{
             this.spinner.hide();
          }
        }else{
          this.spinner.hide();
        }
      },
      error: (err) => {
        this.spinner.hide();
      },
    });
  }

  getArchiveAgendas(ids:any) {
    this.agendas = [];
    let requestObject: any = {
      agendaIds: ids
    };
    this.spinner.show();
    this.agendaArchiveService.getArchiveAgendas(requestObject).subscribe({
      next: (res) => {
        if (res.status) {
          this.agendas = this.formatAgendas(res.data);
        }
          this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
      },
    });
  }

  formatAgendas(data: any) {
    let agendas: any = { inbox: [], sent: [], draft: [] };
    if (data?.length > 0) {
      let serial:any=0;
      data?.map((item: any) => {
        serial++;
        item.serial=serial;
        item.from = item?.raisedByName + '(' + item?.department + ' Department)';
        item.subject = item?.title;
        item.time = item?.createdAt;
        agendas.inbox.push(item);
      });
    }
    return agendas;
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
    this.activeTab = 'inbox';
    this.isDetailView = false;
  }

  selectedMeeting:any="";
  onChangeMeeting(){
    if(this.meetings.length>0){
      this.meetings.map((item:any)=>{
      if(item.meeting==this.selectedMeeting){
        this.getArchiveAgendas(item?.issues);
      }
    });
    }
  }
}
