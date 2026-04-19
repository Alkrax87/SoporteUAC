import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FacultadesService } from '../../services/facultades.service';
import { ReportesService } from '../../services/reportes.service';
import { DashboardService } from '../../services/dashboard.service';
import { Facultad } from '../../interfaces/facultad';
import { Reporte } from '../../interfaces/reporte';
import { combineLatest } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { faDownload, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { DashboardData } from '../../interfaces/dashboard';

@Component({
  selector: 'app-export-reportes',
  imports: [FontAwesomeModule, FormsModule],
  template: `
    <div class="bg-black bg-opacity-70 fixed inset-0 z-50 flex justify-center items-center select-none px-3 sm:px-5">
      <div class="bg-white p-5 rounded-3xl w-full max-w-md">
        <div>
          @if (facultades().length === 0 && reportes.length === 0) {
            <p>Cargando datos...</p>
          } @else {
            <div class="flex gap-2 items-center">
              <div class="bg-contrast py-1 px-1.5 rounded-full">
                <fa-icon [icon]="Excel"></fa-icon>
              </div>
              <h3 class="text-xl font-semibold">Exportar</h3>
            </div>
            <hr class="-mx-5 my-4">
            <div class="flex flex-col gap-4">
              <p class="text-neutral-500">Selecciona el mes que deseas exportar</p>
              <!-- Month selector -->
              <div>
                <label for="type" class="relative">
                  <select id="type" [(ngModel)]="selectedMonth" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                    @for (mes of meses; track $index) {
                      <option [value]="mes.value">{{ mes.label }}</option>
                    }
                  </select>
                  <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Tipo</span>
                </label>
              </div>
              @if (errorMessage()) {
                <p class="text-red-600 text-center text-sm -mt-3">{{ errorMessage() }}</p>
              }
            </div>
          }
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" (click)="close.emit()" class="hover:bg-neutral-100/80 text-neutral-600 border rounded-full px-6 py-2 text-sm duration-300">Cerrar</button>
          <!-- Download -->
          <button (click)="exportToExcel()" class="bg-green-700 hover:bg-green-700/90 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-6 py-2 text-sm duration-300">
            <fa-icon [icon]="Download"></fa-icon> Descargar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ExportReportesComponent {
  private facultadesService = inject(FacultadesService);
  private reportesService = inject(ReportesService);
  private dashboardService =  inject(DashboardService);

  @Output() close = new EventEmitter<void>();

  facultades = signal<Facultad[]>([]);
  reportes = signal<Reporte[]>([]);
  dashboard = signal<DashboardData | null>(null);
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  meses = [
    { value: 0, label: 'Enero' },
    { value: 1, label: 'Febrero' },
    { value: 2, label: 'Marzo' },
    { value: 3, label: 'Abril' },
    { value: 4, label: 'Mayo' },
    { value: 5, label: 'Junio' },
    { value: 6, label: 'Julio' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Septiembre' },
    { value: 9, label: 'Octubre' },
    { value: 10, label: 'Noviembre' },
    { value: 11, label: 'Diciembre' }
  ];
  errorMessage = signal('');

  constructor() {
    this.facultadesService.getFacultades();
    this.reportesService.getReportes();
    combineLatest([this.facultadesService.facultades$, this.reportesService.reportes$, this.dashboardService.dashboard$]).pipe(takeUntilDestroyed()).subscribe({
      next: ([facultades, reportes, dashboard]) => {
        this.facultades.set(facultades);
        this.reportes.set(reportes);
        this.dashboard.set(dashboard);
      }
    });
  }

  Excel = faFileExcel;
  Download = faDownload;

  exportToExcel() {
    const reportesFiltrados = this.reportes().filter((reporte) => {
      if (!reporte.date) return false;

      const d = new Date(reporte.date);
      return d.getMonth() === Number(this.selectedMonth) && d.getFullYear() === this.selectedYear;
    });

    if (reportesFiltrados.length === 0) {
      this.errorMessage.set('No hay registros para el mes seleccionado.');
      return;
    }

    // Data
    const dataReportes = reportesFiltrados.map(r => ({
      'REPORTE': r.report,
      'DESCRIPCIÓN': r.description,
      'TIPO': r.type,
      'FACULTAD': this.getFacultadName(r.school),
      'OFICINA / AULA': r.office,
      'TIEMPO': r.time,
      'CÓDIGO PATRIMONIAL': r.patrimonialCode || 'N/A',
      'FECHA': r.date ? new Date(r.date).toLocaleDateString('es-PE') : 'Sin fecha'
    }));
    const dataByType = this.dashboard()!.reportsByType.monthWeeks.map(item => ({
      'TIPO': item.quarter,
      'TOTAL DE REPORTES': item.value
    }));
    const dataByFacultad = this.dashboard()!.reportsByFacultad.monthWeeks.map(item => ({
      'FACULTAD': item.facultad,
      'TOTAL DE REPORTES': item.value
    }));
    const dataByWeeks = this.dashboard()!.reportsByTime.monthWeeks.map(item => ({
      'SEMANA': item.key,
      'TOTAL DE REPORTES': item.reported
    }));
    const total = reportesFiltrados.length;

    // Worksheets
    const wsReportes: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataReportes);
    const wsTypes: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataByType);
    const wsFacultades: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataByFacultad);
    const wsByWeeks: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataByWeeks);
    const wsTotal: XLSX.WorkSheet = XLSX.utils.json_to_sheet([{ 'TOTAL DE REPORTES': total }]);

    wsReportes['!cols'] = [{ wch: 40 }, { wch: 60 }, { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
    wsTypes['!cols'] = [{ wch: 10 }, { wch: 20 }];
    wsFacultades['!cols'] = [{ wch: 20 }, { wch: 20 }];
    wsByWeeks['!cols'] = [{ wch: 10 }, { wch: 20 }];
    wsTotal['!cols'] = [{ wch: 20 }];

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, wsReportes, 'Reportes');
    XLSX.utils.book_append_sheet(workbook, wsTypes, 'Reportes por Tipo');
    XLSX.utils.book_append_sheet(workbook, wsFacultades, 'Reportes por Facultad');
    XLSX.utils.book_append_sheet(workbook, wsByWeeks, 'Reportes por Semana');
    XLSX.utils.book_append_sheet(workbook, wsTotal, 'Total');

    const month = this.meses.find(m => m.value === Number(this.selectedMonth))?.label;
    const fileName = `Reportes_Soporte_UAC_${month}_${this.selectedYear}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  }

  private getFacultadName(facultadId: string) {
    const facultad = this.facultades().find(f => f._id === facultadId);
    return facultad ? facultad.name : '';
  }
}