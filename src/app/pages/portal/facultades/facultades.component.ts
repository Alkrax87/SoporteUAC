import { Component, inject, signal } from '@angular/core';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { UserLogoutComponent } from '../../../components/user-logout/user-logout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBuilding, faEye, faPenToSquare, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Facultad } from '../../../interfaces/facultad';
import { FacultadesService } from '../../../services/facultades.service';
import { FacultadesModalComponent } from "../../../components/facultades-modal/facultades-modal.component";
import { ConfirmModalComponent } from "../../../components/confirm-modal/confirm-modal.component";
import { FacultadesShowComponent } from "../../../components/facultades-show/facultades-show.component";
import { AuthService } from '../../../services/auth.service';
import { combineLatest } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-facultades',
  imports: [BreadcrumbComponent, FontAwesomeModule, UserLogoutComponent, FacultadesModalComponent, ConfirmModalComponent, FacultadesShowComponent],
  templateUrl: './facultades.component.html',
  styles: ``,
})
export class FacultadesComponent {
  private facultadesService = inject(FacultadesService);
  private authServiceIsAdmin = inject(AuthService).userLogged$;

  constructor() {
    this.facultadesService.getFacultades();
    combineLatest([this.facultadesService.facultades$, this.authServiceIsAdmin]).pipe(takeUntilDestroyed()).subscribe({
      next: ([facultades, user]) => {
        this.facultades.set(facultades);
        if (user) { this.isAdmin.set(user.isAdmin) }
      }
    });

  }

  facultades = signal<Facultad[]>([]);
  selectedFacultad = signal<Facultad | null>(null);
  isAdmin = signal(false);

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