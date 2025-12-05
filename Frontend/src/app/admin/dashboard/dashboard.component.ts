import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { AuthService } from '../../auth/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
declare var Chart: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit {

  issueList = [
    { id: 'ISS-001', title: 'Road Repair', ward: '05', status: 'In-Process', date: '20 Nov 2025' },
    { id: 'ISS-002', title: 'Drainage Block', ward: '11', status: 'Approved', date: '21 Nov 2025' },
    { id: 'ISS-003', title: 'Street Light Not Working', ward: '03', status: 'Rejected', date: '18 Nov 2025' }
  ];

  sidebarCollapsed = false;

onSidebarToggle(state: boolean) {
  this.sidebarCollapsed = state;
}

  ngAfterViewInit(): void {
    const ctx = document.getElementById('issueGraph') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Issues Registered',
          data: [50, 80, 60, 90, 120, 150, 130],
          borderWidth: 3
        }]
      }
    });
  }
}