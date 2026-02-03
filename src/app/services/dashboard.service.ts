import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environments } from '../environment/environments';
import { Summary } from '../interfaces/summary';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private backendUrl = Environments.apiUrl;
  private http = inject(HttpClient);

  private summarySubject = new BehaviorSubject<Summary[]>([]);
  summary$ = this.summarySubject.asObservable();

  constructor() {
    this.getSummary();
  }

  getSummary() {
    this.http.get<Summary[]>(this.backendUrl + '/summary').subscribe({
      next: (data) => {
        this.summarySubject.next(data);
      }
    });
  }
}