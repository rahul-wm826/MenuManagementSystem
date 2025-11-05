import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getProposalsForFunction(functionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/eventfunctions/${functionId}/proposals`);
  }

  getProposalById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/proposals/${id}`);
  }

  createProposal(functionId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/eventfunctions/${functionId}/proposals`, data);
  }

  updateProposal(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/proposals/${id}`, data);
  }
}
