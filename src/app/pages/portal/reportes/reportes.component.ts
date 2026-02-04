import { Component, inject, signal } from '@angular/core';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { UserLogoutComponent } from '../../../components/user-logout/user-logout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ReportesService } from '../../../services/reportes.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Reporte } from '../../../interfaces/reporte';
import { ReportesModalComponent } from "../../../components/reportes-modal/reportes-modal.component";
import { ConfirmModalComponent } from "../../../components/confirm-modal/confirm-modal.component";
import { FacultadesService } from '../../../services/facultades.service';
import { Facultad } from '../../../interfaces/facultad';
import { combineLatest } from 'rxjs';
import { TableComponent } from "../../../components/table/table.component";

@Component({
  selector: 'app-reportes',
  imports: [BreadcrumbComponent, FontAwesomeModule, UserLogoutComponent, ReportesModalComponent, ConfirmModalComponent, TableComponent],
  templateUrl: './reportes.component.html',
  styles: ``,
})
export class ReportesComponent {
  private reportesService = inject(ReportesService);
  private facultadesService = inject(FacultadesService);

  constructor() {
    this.reportesService.getReportes();
    this.facultadesService.getFacultades();
    combineLatest([this.reportesService.reportes$, this.facultadesService.facultades$]).pipe(takeUntilDestroyed()).subscribe({
      next: ([reportes, facultades]) => {
        this.reportes.set(reportes);
        this.facultades.set(facultades);
      }
    });
  }

  reportes = signal<Reporte[]>([]);
  facultades = signal<Facultad[]>([]);
  selectedReporte = signal<Reporte | null>(null);
  tableConstructor = [
    { key: 'report', label: 'Reporte' },
    { key: 'description', label: 'Descripción' },
    { key: 'type', label: 'Tipo', isType: true },
    { key: 'school', label: 'Facultad', search: true},
    { key: 'office', label: 'Oficina / Aula' },
    { key: 'time', label: 'Tiempo', isTime: true },
    { key: 'patrimonialCode', label: 'Cod. Patrimonial' },
    { key: 'date', label: 'Fecha', isDate: true },
  ];

  isReporteModalOpen = signal(false);
  isConfirmModalOpen = signal(false);

  Add = faPlus;

  onAdd() {
    this.selectedReporte.set(null);
    this.isReporteModalOpen.set(true);
  }

  onEdit(reporte: Reporte) {
    this.selectedReporte.set(reporte);
    this.isReporteModalOpen.set(true);
  }

  onDelete(reporte: Reporte) {
    this.selectedReporte.set(reporte);
    this.isConfirmModalOpen.set(true);
  }

  confirmDelete() {
    this.reportesService.deleteReporte(this.selectedReporte()?._id!);
    this.isConfirmModalOpen.set(false);
  }
}