import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}
  

  getCounts(requestObject?: any): Observable<any> {
    return this.http.post(
      `${environment.BASE_URL}/api/get-counts`,
      { requestObject }
    );
  }
  getMonthlyIssuesChart(requestObject?: any): Observable<any> {
    return this.http.post(
      `${environment.BASE_URL}/api/get-monthly-issues-chart`,
      { requestObject }
    );
  }

  getRecentIssues(requestObject?: any): Observable<any> {
    return this.http.post(
      `${environment.BASE_URL}/api/get-recent-issues`,
      { requestObject }
    );
  }


}
