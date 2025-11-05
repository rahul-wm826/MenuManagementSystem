import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
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

  getAllProposals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/proposals`);
  }

  exportPdf(proposalId: string, proposalName: string): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return new Observable(observer => {
      this.http.get(`${this.apiUrl}/proposals/${proposalId}/export/pdf`, httpOptions)
        .subscribe({
          next: (blob: any) => {
            this.saveFile(blob, `${proposalName}.pdf`);
            observer.next({ success: true });
            observer.complete();
          },
          error: (err) => {
            observer.error(err);
          }
        });
    });
  }

  emailProposal(proposalId: string, data: { toEmail: string, message: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/proposals/${proposalId}/email`, data);
  }

  addComment(proposalId: string, data: { author: string, comment: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/proposals/${proposalId}/comments`, data);
  }

  private saveFile(blob: Blob, filename: string) {
    saveAs(blob, filename);
  }
}
