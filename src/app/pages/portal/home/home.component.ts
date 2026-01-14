import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  template: `
    <div class="flex flex-col items-center">
      <h1>Home</h1>
      <button (click)="logout()" class="bg-red-600 text-white rounded-full px-4 py-2">Logout</button>
    </div>
  `,
  styles: ``,
})
export class HomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log(error.error.error);
      }
    });
  }
}
