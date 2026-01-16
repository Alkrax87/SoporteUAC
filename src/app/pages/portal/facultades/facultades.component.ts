import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { UserLogoutComponent } from '../../../components/user-logout/user-logout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-facultades',
  imports: [BreadcrumbComponent, FontAwesomeModule, UserLogoutComponent],
  templateUrl: './facultades.component.html',
  styles: ``,
})
export class FacultadesComponent {
  Add = faPlus;
}