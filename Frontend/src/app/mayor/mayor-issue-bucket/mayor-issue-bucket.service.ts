import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MayorIssueBucketService {
constructor(private http: HttpClient) {}

  getIssueList(requestObject: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/get-issue-list`, {
      requestObject,
    });
  }

  updateStartVotingStatus(requestObject: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/start-voting`, {
      requestObject,
    });
  }

  updateStopVotingStatus(requestObject: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/stop-voting`, {
      requestObject,
    });
  }
}
