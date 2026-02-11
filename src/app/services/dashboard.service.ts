import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environments } from '../environment/environments';
import { DashboardData } from '../interfaces/dashboard';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private backendUrl = Environments.apiUrl;
  private http = inject(HttpClient);

  private dashboardSubject = new BehaviorSubject<DashboardData | null>(null);
  dashboard$ = this.dashboardSubject.asObservable();

  constructor() {
    this.getDataForDashboard();
  }

  getDataForDashboard() {
    this.http.get<DashboardData>(this.backendUrl + '/dashboard').subscribe({
      next: (data) => this.dashboardSubject.next(data),
    });
  }
}