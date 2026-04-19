import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleRight, faArrowRightFromBracket, faUser, faUserShield, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  imports: [NgClass, RouterLink, FontAwesomeModule, RouterLinkActive],
  template: `
    <div class="flex flex-col bg-neutral-900 h-screen duration-300 fixed select-none z-50" [ngClass]="{ 'w-52': isOpen, 'w-14': !isOpen }">
      <!-- Title -->
      <div class="px-2">
        <div routerLink="/portal" class="flex items-center gap-2 rounded-lg cursor-pointer outline-none duration-300 h-14">
          <img loading="lazy" src="assets/uac-logo.png" alt="BRAND-logo" class="rounded-md duration-300 w-10 h-10">
          @if (isOpen) {
            <p class="text-white text-xl truncate">Soporte<span class="font-bold text-main">UAC</span></p>
          }
        </div>
      </div>
      <!-- Button -->
      <div class="relative">
        <div (click)="toggleSidebar()" class="bg-main hover:bg-main-hover text-white cursor-pointer flex justify-center items-center w-8 h-8 absolute rounded-full -top-4 -right-4">
          <fa-icon class="duration-300" [icon]="ArrowClose" [ngClass]="{ 'rotate-180' : isOpen}"></fa-icon>
        </div>
      </div>
      <!-- Divider -->
      <div class="bg-neutral-700 h-0.5"></div>
      <!-- Menu -->
      <div class="text-white flex flex-col gap-4 h-full py-3 px-2">
        @for (section of routesElementesFiltered; track $index) {
          <div>
            @if (isOpen) {
              <p class="text-xs px-2 mb-1 truncate">{{ section.sectionName }}</p>
            } @else {
              <div class="place-content-center h-4 mb-1">
                <div class="bg-neutral-600 rounded-full h-0.5"></div>
              </div>
            }
            <div class="flex flex-col gap-1">
              @for (route of section.routes; track $index) {
                <div [routerLink]="route.route" [routerLinkActive]="['bg-main']" class="hover:bg-main flex gap-2 cursor-pointer pl-4 pr-2 py-2 -ml-2 rounded-r-full duration-300">
                  <div class="min-w-5 max-w-5 text-center">
                    <fa-icon [icon]="route.icon"></fa-icon>
                  </div>
                  @if (isOpen) {
                    <p class="truncate">{{ route.name }}</p>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
      <!-- Divider -->
      <div class="bg-neutral-700 h-0.5"></div>
      <!-- User -->
      <div class="p-2">
         <div class="flex items-center py-2 h-12 gap-2 duration-300 text-white" [ngClass]="{ 'px-2': isOpen }">
            <div class="rounded-full min-w-10 h-10 flex items-center justify-center bg-white text-neutral-700 text-xl" [ngClass]="{ 'cursor-pointer': !isOpen }" (click)="!isOpen && (isLogOutModalOpen.set(true))">
              @if (user.isAdmin) {
                <fa-icon [icon]="Admin"></fa-icon>
              } @else {
                <fa-icon [icon]="User"></fa-icon>
              }
            </div>
            @if (isOpen) {
              <div class="w-full truncate">
                @if (user) {
                  <div class="animate-fade-right delay-75">
                    <p class="font-semibold text-sm -mb-1 truncate">{{ user.name }} {{ user.lastname }}</p>
                    <p class="text-xs text-neutral-300">{{ user.isAdmin ? 'Administrador' : 'Usuario' }}</p>
                  </div>
                }
              </div>
              <div class="flex items-center justify-center text-sm">
                <button (click)="isLogOutModalOpen.set(true)" [ngClass]="{'bg-white text-neutral-800': isLogOutModalOpen()}" class="hover:bg-white hover hover:text-neutral-800 duration-300 rounded-lg w-8 h-8">
                  <fa-icon [icon]="LogOut"></fa-icon>
                </button>
              </div>
            }
        </div>
      </div>
    </div>

    @if (isLogOutModalOpen()) {
      <div class="bg-black bg-opacity-70 fixed inset-0 z-50 flex justify-center items-center select-none px-3 sm:px-5">
        <div class="bg-white p-5 rounded-3xl w-full max-w-sm">
          <h3 class="text-xl font-semibold">Cerrar sesión</h3>
          <p class="my-4">¿Estas seguro de cerrar sesión?</p>
          <div class="flex justify-end gap-2">
              <button type="button" (click)="isLogOutModalOpen.set(false)" class="hover:bg-neutral-100/80 text-neutral-600 border rounded-full px-6 py-2 text-sm duration-300">Cancelar</button>
              <button type="submit" (click)="logout()" class="bg-main hover:bg-main/90 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-6 py-2 text-sm duration-300">
                <fa-icon [icon]="LogOut"></fa-icon>&nbsp; Cerrar sesión
              </button>
            </div>
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class SidebarComponent {
  @Input() routesElements: { sectionName: string; requireAdmin?: boolean; routes: { route: string; name: string; icon: IconDefinition }[] }[] = [];
  @Output() sidebarOpen = new EventEmitter<boolean>();

  private authService = inject(AuthService);
  private router = inject(Router);
  user!: { name: string, lastname: string, isAdmin: boolean };

  constructor() {
    this.authService.userLogged$.pipe(takeUntilDestroyed()).subscribe({
      next: (data) => {
        this.user = data!;
      }
    });
  }

  isOpen: boolean = true;
  isLogOutModalOpen = signal(false);

  ArrowClose = faAngleRight;
  User = faUser;
  Admin = faUserShield;
  LogOut = faArrowRightFromBracket;

  get routesElementesFiltered() {
    return this.routesElements.filter((section) => {
      return !section.requireAdmin || this.user.isAdmin;
    });
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.sidebarOpen.emit(this.isOpen);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
        this.isLogOutModalOpen.set(false);
      },
    });
  }
}