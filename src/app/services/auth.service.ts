import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environments } from '../environment/environments';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = Environments.apiUrl;
  private http = inject(HttpClient);

  userSubject = new BehaviorSubject<{ name: string, lastname: string, isAdmin: boolean } | null>(null);
  userLogged$ = this.userSubject.asObservable();

  checkAuth() {
    return this.http.get<{ name: string, lastname: string, isAdmin: boolean }>(`${this.apiUrl}/auth/check-auth`, { withCredentials: true }).pipe(
      tap((response) => this.userSubject.next(response)),
    );
  }

  login(username: string, password: string) {
    return this.http.post<{ message: string, user: User }>(`${this.apiUrl}/auth/login`, { username, password }, { withCredentials: true });
  }

  logout() {
    return this.http.get(`${this.apiUrl}/auth/logout`, { withCredentials: true });
  }

  resetPassword(userID: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/auth/reset-password/${userID}`, { newPassword }, { withCredentials: true });
  }
}