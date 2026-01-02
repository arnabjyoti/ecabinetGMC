import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VotePageService {
constructor(private http: HttpClient) {}

  getVotePageData(requestObject: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/get-vote-page-data`, {
      requestObject,
    });
  }

  getIssueAttachments(requestObject: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/get-issue-attachments`, {
      requestObject,
    });
  }

  getVoters(requestObject: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/get-voters`, {
      requestObject,
    });
  }

  castVote(requestObject: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/cast-vote`, {
      requestObject,
    });
  }
}
