import { Component, inject, signal } from '@angular/core';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { UserLogoutComponent } from '../../../components/user-logout/user-logout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faKey, faPenToSquare, faPlus, faTag, faTrashCan, faUser, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { UsuariosModalComponent } from '../../../components/usuarios-modal/usuarios-modal.component';
import { User } from '../../../interfaces/user';
import { UsersService } from '../../../services/users.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmModalComponent } from "../../../components/confirm-modal/confirm-modal.component";
import { UsuariosResetPasswordComponent } from "../../../components/usuarios-reset-password/usuarios-reset-password.component";

@Component({
  selector: 'app-usuarios',
  imports: [BreadcrumbComponent, FontAwesomeModule, UserLogoutComponent, UsuariosModalComponent, ConfirmModalComponent, UsuariosResetPasswordComponent],
  templateUrl: './usuarios.component.html',
  styles: ``,
})
export class UsuariosComponent {
  private usersService = inject(UsersService);

  constructor() {
    this.usersService.getUsers();
    this.usersService.users$.pipe(takeUntilDestroyed()).subscribe({
      next: (data) => this.users.set(data),
    });
  }

  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);

  isUserModalOpen = signal(false);
  isResetPasswordModalOpen = signal(false);
  isConfirmModalOpen = signal(false);

  Add = faPlus;
  User = faUser;
  Admin = faUserShield;
  Key = faKey;
  Tag = faTag;
  Edit = faPenToSquare;
  Delete = faTrashCan;


  onAdd() {
    this.selectedUser.set(null);
    this.isUserModalOpen.set(true);
  }

  onResetPassword(user: User) {
    this.selectedUser.set(user);
    this.isResetPasswordModalOpen.set(true);
  }

  onEdit(user: User) {
    this.selectedUser.set(user);
    this.isUserModalOpen.set(true);
  }

  onDelete(user: User) {
    this.selectedUser.set(user);
    this.isConfirmModalOpen.set(true);
  }

  confirmDelete() {
    this.usersService.deleteUser(this.selectedUser()?._id!)
    this.isConfirmModalOpen.set(false);
  }
}