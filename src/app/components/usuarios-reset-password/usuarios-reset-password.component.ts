import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-usuarios-reset-password',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="bg-black bg-opacity-70 fixed inset-0 z-50 flex justify-center items-center select-none px-3 sm:px-5">
      <div class="bg-white p-5 rounded-3xl w-full max-w-sm">
        <h3 class="text-xl font-semibold">Cambiar Contraseña</h3>
        <form [formGroup]="form" (ngSubmit)="onReset()">
          <!-- New Password -->
          <div class="my-4">
            <label for="newPassword" class="relative">
              <input id="newPassword" type="password" formControlName="newPassword" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
              <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Nueva Contraseña</span>
            </label>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="hover:bg-neutral-100/80 text-neutral-600 border rounded-full px-6 py-2 text-sm duration-300">Cancelar</button>
            <button type="submit" [disabled]="form.invalid" class="bg-indigo-800 hover:bg-indigo-800/90 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-6 py-2 text-sm duration-300">
              <fa-icon [icon]="Key"></fa-icon>&nbsp; Cambiar Contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class UsuariosResetPasswordComponent {
  @Input() user!: User;
  @Output() close = new EventEmitter<void>();

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  Key = faKey;

  onReset() {
    if (this.form.invalid) {
      return;
    }

    this.authService.resetPassword(this.user._id!, this.form.value.newPassword!).subscribe({
      next: () => this.close.emit(),
    });
  }
}