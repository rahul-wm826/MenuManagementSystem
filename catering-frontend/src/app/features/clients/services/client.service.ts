import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clients`);
  }

  getClientById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clients/${id}`);
  }

  createClient(data: { name: string, contactPerson?: string, email?: string, phone?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clients`, data);
  }

  updateClient(id: string, data: { name: string, contactPerson?: string, email?: string, phone?: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/clients/${id}`, data);
  }

  deleteClient(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/clients/${id}`);
  }
}
