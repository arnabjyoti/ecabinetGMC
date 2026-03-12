import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgendaArchiveService {
  constructor(private http: HttpClient) {}

  getArchiveMeetings(requestObject: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/get-archive-meetings`, {
      requestObject,
    });
  }

  getArchiveAgendas(requestObject: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/get-archive-agendas`, {
      requestObject,
    });
  }
}
