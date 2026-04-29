import { inject, Injectable } from '@angular/core';
import { Environments } from '../environment/environments';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Excel } from '../interfaces/excel';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private apiUrl = Environments.apiUrl;
  private http = inject(HttpClient);

  private excelSubject = new BehaviorSubject<Excel | null>(null);
  excel$ = this.excelSubject.asObservable();

  getExcelData(year: number, month: number) {
    this.http.get<Excel>(`${this.apiUrl}/dashboard/excel/${year}/${month}`).subscribe({
      next: (data) => this.excelSubject.next(data),
    });
  }
}