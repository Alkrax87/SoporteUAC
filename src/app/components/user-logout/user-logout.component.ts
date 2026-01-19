import { Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-logout',
  imports: [FontAwesomeModule],
  template: `
    <div class="bg-light flex items-center justify-center rounded-xl h-full min-w-[92px] text-lg p-4">
      <button type="button" (click)="openLogoutModal.set(true)" class="hover:bg-[#F1F1F1] p-2 rounded-full flex items-center justify-center cursor-pointer w-full h-full duration-300">
        <fa-icon [icon]="User"></fa-icon>
      </button>
    </div>

    @if (openLogoutModal()) {
      <div class="bg-black bg-opacity-70 fixed inset-0 z-50 flex justify-center items-center select-none px-3 sm:px-5">
        <div class="bg-white p-5 rounded-3xl w-full max-w-sm">
          <h3 class="text-xl font-semibold">Cerrar sesión</h3>
          <p class="my-4">¿Estas seguro de cerrar sesión?</p>
          <div class="flex justify-end gap-2">
              <button type="button" (click)="openLogoutModal.set(false)" class="hover:bg-neutral-100/80 text-neutral-600 border rounded-full px-6 py-2 text-sm duration-300">Cancelar</button>
              <button type="submit" (click)="logout()" class="bg-main hover:bg-main/90 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-6 py-2 text-sm duration-300">
                <fa-icon [icon]="Logout"></fa-icon>&nbsp; Cerrar sesión
              </button>
            </div>
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class UserLogoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  User = faUser;
  Logout = faArrowRightFromBracket;

  openLogoutModal = signal(false);

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
        this.openLogoutModal.set(false);
      },
    });
  }
}