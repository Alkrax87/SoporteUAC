import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PortalComponent } from './pages/portal/portal.component';
import { UsuariosComponent } from './pages/portal/usuarios/usuarios.component';
import { DashboardComponent } from './pages/portal/dashboard/dashboard.component';
import { ReportesComponent } from './pages/portal/reportes/reportes.component';
import { PendientesComponent } from './pages/portal/pendientes/pendientes.component';
import { FacultadesComponent } from './pages/portal/facultades/facultades.component';
import { AulasComponent } from './pages/portal/aulas/aulas.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard],
    title: 'Soporte UAC - Iniciar Sesión',
  },
  {
    path: 'portal',
    component: PortalComponent,
    canActivate: [authGuard],
    title: 'Soporte UAC',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'usuarios', canActivate: [adminGuard], component: UsuariosComponent, title: 'Soporte UAC - Usuarios'},
      { path: 'dashboard', component: DashboardComponent, title: 'Soporte UAC - Dashboard'},
      { path: 'reportes', component: ReportesComponent, title: 'Soporte UAC - Reportes'},
      { path: 'pendientes', component: PendientesComponent, title: 'Soporte UAC - Pendientes'},
      { path: 'facultades', component: FacultadesComponent, title: 'Soporte UAC - Facultades'},
      { path: 'aulas', component: AulasComponent, title: 'Soporte UAC - Aulas'},
    ],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];