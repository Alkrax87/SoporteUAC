import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PortalComponent } from './pages/portal/portal.component';
import { HomeComponent } from './pages/portal/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'portal',
    component: PortalComponent,
    title: 'Soporte UAC',
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, title: 'Soporte UAC - Home'}
    ],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
