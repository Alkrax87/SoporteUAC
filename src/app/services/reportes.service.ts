import { inject, Injectable } from '@angular/core';
import { Environments } from '../environment/environments';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Reporte } from '../interfaces/reporte';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private apiUrl = Environments.apiUrl;
  private http = inject(HttpClient);

  private reportesSubject = new BehaviorSubject<Reporte[]>([]);
  reportes$ = this.reportesSubject.asObservable();

  getReportes() {
    this.http.get<Reporte[]>(`${this.apiUrl}/reportes`).subscribe({
      next: (data) => this.reportesSubject.next(data),
    });
  }

  addReporte(reporte: Reporte) {
    this.http.post<Reporte>(`${this.apiUrl}/reportes`, reporte).subscribe({
      next: () => this.getReportes(),
    });
  }

  editReporte(reporte: Reporte) {
    this.http.put<Reporte>(`${this.apiUrl}/reportes/${reporte._id}`, reporte).subscribe({
      next: () => this.getReportes(),
    });
  }

  deleteReporte(id: string) {
    this.http.delete(`${this.apiUrl}/reportes/${id}`).subscribe({
      next: () => this.getReportes(),
    });
  }
}