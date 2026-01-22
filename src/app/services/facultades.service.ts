import { inject, Injectable } from '@angular/core';
import { Environments } from '../environment/environments';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Facultad } from '../interfaces/facultad';

@Injectable({
  providedIn: 'root',
})
export class FacultadesService {
  private apiUrl = Environments.apiUrl;
  private http = inject(HttpClient);

  private facultadesSubject = new BehaviorSubject<Facultad[]>([]);
  facultades$ = this.facultadesSubject.asObservable();

  getFacultades() {
    this.http.get<Facultad[]>(`${this.apiUrl}/facultades`).subscribe({
      next: (data) => this.facultadesSubject.next(data),
    });
  }

  addFacultad(facultad: Facultad) {
    this.http.post<Facultad>(`${this.apiUrl}/facultades`, facultad).subscribe({
      next: () => this.getFacultades(),
    });
  }

  editFacultad(facultad: Facultad) {
    this.http.put<Facultad>(`${this.apiUrl}/facultades/${facultad._id}`, facultad).subscribe({
      next: () => this.getFacultades(),
    });
  }

  deleteFacultad(id: string) {
    this.http.delete(`${this.apiUrl}/facultades/${id}`).subscribe({
      next: () => this.getFacultades(),
    });
  }
}