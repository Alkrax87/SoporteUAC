import { inject, Injectable } from '@angular/core';
import { Environments } from '../environment/environments';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Pendiente } from '../interfaces/pendiente';

@Injectable({
  providedIn: 'root',
})
export class PendientesService {
  private apiUrl = Environments.apiUrl;
  private http = inject(HttpClient);

  private pendientesSubject = new BehaviorSubject<Pendiente[]>([]);
  pendientes$ = this.pendientesSubject.asObservable();

  getPendiente() {
    this.http.get<Pendiente[]>(`${this.apiUrl}/pendientes`).subscribe({
      next: (data) => this.pendientesSubject.next(data),
    });
  }

  addPendiente(pendiente: Pendiente) {
    this.http.post<Pendiente>(`${this.apiUrl}/pendientes`, pendiente).subscribe({
      next: () => this.getPendiente(),
    });
  }

  editPendiente(pendiente: Pendiente) {
    this.http.put<Pendiente>(`${this.apiUrl}/pendientes/${pendiente._id}`, pendiente).subscribe({
      next: () => this.getPendiente(),
    });
  }

  deletePendiente(id: string) {
    this.http.delete(`${this.apiUrl}/pendientes/${id}`).subscribe({
      next: () => this.getPendiente(),
    });
  }
}