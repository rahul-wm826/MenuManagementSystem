import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicProposalService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getPublicProposal(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/proposals/public/${token}`);
  }
}
