import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // --- Parent Event Methods ---
  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events`);
  }

  getEventById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/events/${id}`);
  }

  createEvent(data: { clientId: string, name: string, status: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/events`, data);
  }

  // --- Child EventFunction Methods ---
  getFunctionsForEvent(eventId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events/${eventId}/functions`);
  }

  createFunction(eventId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/events/${eventId}/functions`, data);
  }

  updateFunction(functionId: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/functions/${functionId}`, data);
  }

  deleteFunction(functionId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/functions/${functionId}`);
  }
}
