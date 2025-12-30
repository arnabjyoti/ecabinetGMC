import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IssueDetailsService {

  constructor(private http: HttpClient) {}

  updateIssue(requestObject: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/update-issue`, {
      requestObject,
    });
  }
}
