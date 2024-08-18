import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3000/api'; // URL ของ API ของคุณ
  private userId: number | null = null;

  constructor(private http: HttpClient) { }

  
  login(email: string, password: string): Observable<{ token: string; user: { user_id: number; firstName: string; lastName: string } }> { 
    return this.http.post<{ token: string; user: { user_id: number; firstName: string; lastName: string } }>(`${this.apiUrl}/login`, { email, password });
  
  }

  setUserId(userId: number): void {
    this.userId = userId;
    localStorage.setItem('userId', userId.toString());
  }

  getUserId(): number | null {
    return this.userId;
  }

  
}
