import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BreadcrumbComponent } from "../../../components/breadcrumb/breadcrumb.component";
import { UserLogoutComponent } from "../../../components/user-logout/user-logout.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar';

@Component({
  selector: 'app-dashboard',
  imports: [BreadcrumbComponent, FontAwesomeModule, DatePipe, UserLogoutComponent ],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export class DashboardComponent {
  today = new Date();

  Calendar = faCalendar;
}