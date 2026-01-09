import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { AuthService } from '../../auth/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from './dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var Chart: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit {
  user: any = null;
  constructor(
    private appService: AppService,
    private authService: AuthService,
    private http: HttpClient,
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
  ) {
    this.user = {
      userId: this.authService.getUserId(),
      name: this.authService.getUserName(),
      email: this.authService.getEmail(),
      role: this.authService.getRole(),
      department: this.authService.getDepartment(),
      isVoter: this.authService.getIsVoter(),
    };

    // this.user = JSON.parse(user || '{"name": "" }');
  }

  counts: any = {};
  chartData: any = {
    labels: [],
    datasets: [],
  };
  recentIssues: any = [];

  ngOnInit(): void {
    this.getAnalyticsData();
    this.getMonthlyIssuesForChart();
    this.getRecentIssuesFromServer();
  }

  issueList = [
    {
      id: 'ISS-001',
      title: 'Road Repair',
      ward: '05',
      status: 'In-Process',
      date: '20 Nov 2025',
    },
    {
      id: 'ISS-002',
      title: 'Drainage Block',
      ward: '11',
      status: 'Approved',
      date: '21 Nov 2025',
    },
    {
      id: 'ISS-003',
      title: 'Street Light Not Working',
      ward: '03',
      status: 'Rejected',
      date: '18 Nov 2025',
    },
  ];

  sidebarCollapsed = false;

  onSidebarToggle(state: boolean) {
    this.sidebarCollapsed = state;
  }

  ngAfterViewInit(): void {
    // const ctx = document.getElementById('issueGraph') as HTMLCanvasElement;
    // new Chart(ctx, {
    //   type: 'line',
    //   data : this.chartData
    //   // data: {
    //   //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    //   //   datasets: [
    //   //     {
    //   //       label: 'Issues Registered',
    //   //       data: [50, 80, 60, 90, 120, 150, 130],
    //   //       borderWidth: 3,
    //   //     },
    //   //     {
    //   //       label: 'Issues Resolved',
    //   //       data: [30, 40, 60, 90, 120, 150, 130],
    //   //       borderWidth: 3,
    //   //     },
    //   //   ],
    //   // },
    // });
  }

  getAnalyticsData = () => {
    this.spinner.show();
    let requestObject: any = {
      role: this.user.role,
      department: this.user.department,
      userId: this.user.userId,
    };
    this.dashboardService.getCounts(requestObject).subscribe((result: any) => {
      console.log(result);
      this.counts = result.data;
      this.spinner.hide();
    });
  };
  getRecentIssuesFromServer = () => {
    this.spinner.show();
    let requestObject: any = {
      role: this.user.role,
      department: this.user.department,
      userId: this.user.userId,
    };
    this.dashboardService.getRecentIssues(requestObject).subscribe((result: any) => {
      console.log("getRecentIssuesFromServer ", result);
      this.recentIssues = result.data;
      this.spinner.hide();
    });
  };

  getMonthlyIssuesForChart = () => {
    this.spinner.show();
    let requestObject: any = {
      role: this.user.role,
      department: this.user.department,
      userId: this.user.userId,
    };
    this.dashboardService
      .getMonthlyIssuesChart(requestObject)
      .subscribe((result: any) => {
        console.log('getMonthlyIssuesForChart =>', result.data);
        this.chartData = result.data;
        this.spinner.hide();
        // Chart is created AFTER data is ready
        const ctx = document.getElementById('issueGraph') as HTMLCanvasElement;
        new Chart(ctx, {
          type: 'line',
          data: this.chartData,
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Monthly Issues' },
            },
          },
        });
      });
  };
}
