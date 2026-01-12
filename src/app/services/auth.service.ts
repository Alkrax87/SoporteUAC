import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environments } from '../environment/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = Environments.apiUrl;
  private http = inject(HttpClient);

  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }
}
