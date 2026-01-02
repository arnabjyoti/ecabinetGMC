import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VotingZoneService {
constructor(private http: HttpClient) {}

  getVotingReadyIssueList(requestObject: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/get-voting-ready-issue-list`, {
      requestObject,
    });
  }

   stopVoting(requestObject: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/stop-voting`, {
      requestObject,
    });
  }
}
