import { Component, inject, signal } from '@angular/core';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { UserLogoutComponent } from '../../../components/user-logout/user-logout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { TableComponent } from "../../../components/table/table.component";
import { PendientesService } from '../../../services/pendientes.service';
import { FacultadesService } from '../../../services/facultades.service';
import { combineLatest } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Pendiente } from '../../../interfaces/pendiente';
import { Facultad } from '../../../interfaces/facultad';
import { PendientesModalComponent } from "../../../components/pendientes-modal/pendientes-modal.component";
import { ConfirmModalComponent } from "../../../components/confirm-modal/confirm-modal.component";
import { PendientesRedirectModalComponent } from "../../../components/pendientes-redirect-modal/pendientes-redirect-modal.component";

@Component({
  selector: 'app-pendientes',
  imports: [BreadcrumbComponent, FontAwesomeModule, UserLogoutComponent, TableComponent, PendientesModalComponent, ConfirmModalComponent, PendientesRedirectModalComponent],
  templateUrl: './pendientes.component.html',
  styles: ``,
})
export class PendientesComponent {
  private pendientesService = inject(PendientesService);
  private facultadesService = inject(FacultadesService);

  constructor() {
    this.pendientesService.getPendiente();
    this.facultadesService.getFacultades();

    combineLatest([this.pendientesService.pendientes$, this.facultadesService.facultades$]).pipe(takeUntilDestroyed()).subscribe({
      next: ([pendientes, facultades]) => {
        this.pendientes.set(pendientes);
        this.facultades.set(facultades);
      }
    });
  }

  pendientes = signal<Pendiente[]>([]);
  facultades = signal<Facultad[]>([]);
  selectedPendiente = signal<Pendiente | null>(null);
  tableConstructor = [
    { key: 'report', label: 'Reporte' },
    { key: 'description', label: 'Descripción' },
    { key: 'type', label: 'Tipo', isType: true },
    { key: 'school', label: 'Facultad', search: true},
    { key: 'office', label: 'Oficina / Aula' },
    { key: 'date', label: 'Fecha', isDate: true },
  ];

  isPendienteModalOpen = signal(false);
  isConfirmModalOpen = signal(false);
  isPendienteRedirectModalOpen = signal(false);

  Add = faPlus;

  onAdd() {
    this.selectedPendiente.set(null);
    this.isPendienteModalOpen.set(true);
  }

  onEdit(pendiente: Pendiente) {
    this.selectedPendiente.set(pendiente);
    this.isPendienteModalOpen.set(true);
  }

  onDelete(pendiente: Pendiente) {
    this.selectedPendiente.set(pendiente);
    this.isConfirmModalOpen.set(true);
  }

  confirmDelete() {
    this.pendientesService.deletePendiente(this.selectedPendiente()?._id!);
    this.isConfirmModalOpen.set(false);
  }

  onSend(pendiente: Pendiente) {
    this.selectedPendiente.set(pendiente);
    this.isPendienteRedirectModalOpen.set(true);
  }
}