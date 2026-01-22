import { Component, inject, signal } from '@angular/core';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { UserLogoutComponent } from '../../../components/user-logout/user-logout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBuilding, faEye, faPenToSquare, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Facultad } from '../../../interfaces/facultad';
import { FacultadesService } from '../../../services/facultades.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FacultadesModalComponent } from "../../../components/facultades-modal/facultades-modal.component";
import { ConfirmModalComponent } from "../../../components/confirm-modal/confirm-modal.component";
import { FacultadesShowComponent } from "../../../components/facultades-show/facultades-show.component";

@Component({
  selector: 'app-facultades',
  imports: [BreadcrumbComponent, FontAwesomeModule, UserLogoutComponent, FacultadesModalComponent, ConfirmModalComponent, FacultadesShowComponent],
  templateUrl: './facultades.component.html',
  styles: ``,
})
export class FacultadesComponent {
  private facultadesService = inject(FacultadesService);

  constructor() {
    this.facultadesService.getFacultades();
    this.facultadesService.facultades$.pipe(takeUntilDestroyed()).subscribe({
      next: (data) => this.facultades.set(data),
    });
  }

  facultades = signal<Facultad[]>([]);
  selectedFacultad = signal<Facultad | null>(null);

  isFacultadModalOpen = signal(false);
  isShowModalOpen = signal(false);
  isConfirmModalOpen = signal(false);

  Add = faPlus;
  Bulding = faBuilding;
  Show = faEye;
  Edit = faPenToSquare;
  Delete = faTrashCan;

  onAdd() {
    this.selectedFacultad.set(null);
    this.isFacultadModalOpen.set(true);
  }

  onShow(facultad: Facultad) {
    this.selectedFacultad.set(facultad);
    this.isShowModalOpen.set(true);
  }

  onEdit(facultad: Facultad) {
    this.selectedFacultad.set(facultad);
    this.isFacultadModalOpen.set(true);
  }

  onDelete(facultad: Facultad) {
    this.selectedFacultad.set(facultad);
    this.isConfirmModalOpen.set(true);
  }

  confirmDelete() {
    this.facultadesService.deleteFacultad(this.selectedFacultad()?._id!);
    this.isConfirmModalOpen.set(false);
  }
}