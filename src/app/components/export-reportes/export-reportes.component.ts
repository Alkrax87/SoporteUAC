import { Component, DestroyRef, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExcelService } from '../../services/excel.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { faDownload, faFileExcel, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { Excel } from '../../interfaces/excel';

@Component({
  selector: 'app-export-reportes',
  imports: [FontAwesomeModule, FormsModule],
  template: `
    <div class="bg-black bg-opacity-70 fixed inset-0 z-50 flex justify-center items-center select-none px-3 sm:px-5">
      <div class="bg-white p-5 rounded-3xl w-full max-w-md">
        <div>
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
            <div class="w-full">
              <label for="type" class="relative">
                <select id="type" [(ngModel)]="selectedMonth" (ngModelChange)="getExelData()" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
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
            @if (message()) {
              <p class="text-green-600 text-center text-sm -mt-3">{{ message() }}</p>
            }
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" (click)="close.emit()" class="hover:bg-neutral-100/80 text-neutral-600 border rounded-full px-6 py-2 text-sm duration-300">Cerrar</button>
          <!-- Download -->
            <button (click)="exportToExcel()" [disabled]="isDownloadDisable()" class="bg-green-700 hover:bg-green-700/90 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-6 py-2 text-sm duration-300">
              <fa-icon [icon]="Download"></fa-icon> Descargar
            </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ExportReportesComponent {
  private exelService = inject(ExcelService);
  private destroy = inject(DestroyRef);

  @Output() close = new EventEmitter<void>();

  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  meses = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];
  exelData = signal<Excel | null>(null);
  isDownloadDisable = signal(true);
  errorMessage = signal('');
  message = signal('');

  Excel = faFileExcel;
  Download = faDownload;
  Search = faMagnifyingGlass

  ngOnInit() {
    this.getExelData();
  }

  getExelData() {
    this.exelService.getExcelData(this.selectedMonth);
    this.exelService.excel$.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (data) => {
        this.exelData.set(data);
        if (data?.total === 0) {
          this.errorMessage.set('No hay registros para el mes seleccionado.');
          this.isDownloadDisable.set(true);
          this.message.set('');
          this.exelData.set(null);
        } else {
          this.errorMessage.set('');
          this.isDownloadDisable.set(false);
          this.message.set(`Total de reportes: ${data?.total}`);
        }
      }
    });
  }

  exportToExcel() {
    // Data
    const dataReportes = this.exelData()!.reportes.map(r => ({
      'REPORTE': r.report,
      'DESCRIPCIÓN': r.description,
      'TIPO': r.type,
      'FACULTAD': r.school,
      'OFICINA / AULA': r.office,
      'TIEMPO': r.time,
      'CÓDIGO PATRIMONIAL': r.patrimonialCode || 'N/A',
      'FECHA': r.date ? new Date(r.date).toLocaleDateString('es-PE') : 'Sin fecha'
    }));
    const dataByType = this.exelData()!.dataByType.map(item => ({
      'TIPO': item.quarter,
      'TOTAL DE REPORTES': item.value
    }));
    const dataByFacultad = this.exelData()!.dataByFacultad.map(item => ({
      'FACULTAD': item.facultad,
      'TOTAL DE REPORTES': item.value
    }));
    const dataByWeeks = this.exelData()!.dataByWeeks.map(item => ({
      'SEMANA': item.key,
      'TOTAL DE REPORTES': item.reported
    }));
    const total = this.exelData()!.total;

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
    XLSX.utils.book_append_sheet(workbook, wsReportes, 'Lista de Reportes');
    XLSX.utils.book_append_sheet(workbook, wsTypes, 'Reportes por Tipo');
    XLSX.utils.book_append_sheet(workbook, wsFacultades, 'Reportes por Facultad');
    XLSX.utils.book_append_sheet(workbook, wsByWeeks, 'Reportes por Semana');
    XLSX.utils.book_append_sheet(workbook, wsTotal, 'Total');

    const month = this.meses.find(m => m.value === Number(this.selectedMonth))?.label;
    const fileName = `Reportes_Soporte_DTI_UAC_${month}_${this.selectedYear}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  }
}