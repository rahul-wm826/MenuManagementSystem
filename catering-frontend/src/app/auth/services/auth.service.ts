import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  $isLoggedIn = this.isLoggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(c: any): Observable<any> {
    this.isLoggedIn.next(true);
    return this.http.post(`${this.apiUrl}/api/auth/login`, c);
  }

  register(u: any): Observable<any> {
    this.isLoggedIn.next(true);
    return this.http.post(`${this.apiUrl}/api/auth/register`, u);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
    this.isLoggedIn.next(false);
  }

  checkIfLoggedIn() {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }
}
