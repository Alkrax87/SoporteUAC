import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <div class="w-full h-dvh">
      <div class="relative h-screen select-none">
        <!-- Background -->
        <img loading="lazy" class="absolute inset-0 w-full h-full object-cover z-0" src="./assets/uac-background.jpg" alt="Image-Background" />
        <div class="absolute bg-black inset-0 bg-opacity-50 z-10"></div>
        <!-- Login -->
        <div class="absolute inset-0 z-20 flex items-center justify-center">
          <div class="bg-white px-8 py-12 rounded-xl shadow-lg w-full max-w-sm text-center">
            <h1 class="text-main font-bold text-3xl">Soporte UAC</h1>
            <p class="text-neutral-400 text-sm">Inicia sesión usando tu usuario y contraseña.</p>
            <form [formGroup]="form" (ngSubmit)="login()">
              <div class="flex flex-col gap-4 pt-8">
                <!-- Username -->
                <div>
                  <label for="username" class="relative">
                    <input id="username" type="text" formControlName="username" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                    <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Usuario</span>
                  </label>
                </div>
                <!-- Password -->
                <div>
                  <label for="password" class="relative">
                    <input id="password" type="password" formControlName="password" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                    <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Contraseña</span>
                  </label>
                </div>
              </div>
              <!-- Error -->
              <p class="text-red-500 text-sm h-8 content-center">{{ errorMessage() }}</p>
              <!-- Button -->
              <button type="submit" class="bg-main hover:bg-main-hover text-white shadow-sm w-full font-semibold px-4 py-3 rounded-full cursor-pointer outline-none">
                Ingresar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorMessage = signal<string>('');

  login() {
    if (this.form.invalid) {
      this.errorMessage.set('Por favor, complete todos los campos.');
      return;
    }

    this.authService.login(this.form.value.username!, this.form.value.password!).subscribe({
      next: (response) => {
        this.authService.userSubject.next(response.user as User);
        this.router.navigate(['/portal']);
      },
      error: (error) => {
        this.authService.userSubject.next(null);
        this.errorMessage.set(error.error.error);
      }
    });
  }
}