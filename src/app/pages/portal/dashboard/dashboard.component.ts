import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BreadcrumbComponent } from "../../../components/breadcrumb/breadcrumb.component";
import { UserLogoutComponent } from "../../../components/user-logout/user-logout.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '../../../services/dashboard.service';
import { Summary } from '../../../interfaces/summary';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [BreadcrumbComponent, FontAwesomeModule, DatePipe, UserLogoutComponent ],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export class DashboardComponent {
  private dashboardService =  inject(DashboardService);
  today = new Date();

  summary = signal<Summary[]>([]);

  constructor() {
    this.dashboardService.getSummary();
    this.dashboardService.summary$.pipe(takeUntilDestroyed()).subscribe({
      next: (data) => {
        this.summary.set(data);
      }
    });
  }

  Calendar = faCalendar;
  Clipboard = faClipboardList;
}