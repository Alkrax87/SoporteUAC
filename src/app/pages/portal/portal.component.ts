import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { NgClass } from '@angular/common';
import { faChartArea, faClipboardList, faGraduationCap, faHourglassHalf, faSchool, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-portal',
  imports: [RouterOutlet, SidebarComponent, NgClass],
  template: `
    <div class="flex h-dvh">
      <app-sidebar [routesElements]="routes" (sidebarOpen)="seeStatus($event)"></app-sidebar>
      <div class="bg-[#F1F1F1] w-full duration-300 flex flex-col min-h-dvh h-fit" [ngClass]="{ 'pl-52': sidebarOpen, 'pl-14': !sidebarOpen }">
        <div class="flex-1">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class PortalComponent {
  sidebarOpen: boolean = true;
  routes = [
    {
      sectionName: 'Admin',
      routes: [
        { route: 'usuarios', name: 'Usuarios', icon: faUsers },
      ]
    },
    {
      sectionName: 'Menú',
      routes: [
        { route: 'dashboard', name: 'Dashboard', icon: faChartArea },
        { route: 'reportes', name: 'Reportes', icon: faClipboardList },
        { route: 'pendientes', name: 'Pendientes', icon: faHourglassHalf },
      ]
    },
    {
      sectionName: 'Gestión',
      routes: [
        { route: 'facultades', name: 'Facultades', icon: faSchool },
        { route: 'aulas', name: 'Aulas', icon: faGraduationCap },
      ]
    },
  ];

  seeStatus(status: boolean) { this.sidebarOpen = status }
}
