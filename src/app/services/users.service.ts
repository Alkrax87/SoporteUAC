import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environments } from '../environment/environments';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = Environments.apiUrl;
  private http = inject(HttpClient);

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  getUsers() {
    this.http.get<User[]>(`${this.apiUrl}/users`).subscribe({
      next: (data) => this.usersSubject.next(data),
    });
  }

  addUser(user: User) {
    this.http.post<User>(`${this.apiUrl}/users`, user).subscribe({
      next: () => this.getUsers(),
    });
  }

  editUser(user: User) {
    this.http.put<User>(`${this.apiUrl}/users/${user._id}`, user).subscribe({
      next: () => this.getUsers(),
    });
  }

  deleteUser(id: string) {
    this.http.delete(`${this.apiUrl}/users/${id}`).subscribe({
      next: () => this.getUsers(),
    });
  }
}