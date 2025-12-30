import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VotePageService {
constructor(private http: HttpClient) {}

  getIssueAttachments(requestObject: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/get-issue-attachments`, {
      requestObject,
    });
  }
}
