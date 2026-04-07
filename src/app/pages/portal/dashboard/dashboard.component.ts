import { Component, inject, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { BreadcrumbComponent } from "../../../components/breadcrumb/breadcrumb.component";
import { UserLogoutComponent } from "../../../components/user-logout/user-logout.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar';
import { faBuilding, faCalendarWeek, faChartBar, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '../../../services/dashboard.service';
import { Summary } from '../../../interfaces/dashboard';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
import { ModuleRegistry, AllCommunityModule } from 'ag-charts-community';

ModuleRegistry.registerModules([AllCommunityModule]);


@Component({
  selector: 'app-dashboard',
  imports: [BreadcrumbComponent, FontAwesomeModule, DatePipe, UserLogoutComponent, AgCharts, NgClass],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export class DashboardComponent {
  private dashboardService =  inject(DashboardService);
  today = new Date();

  summary = signal<Summary[]>([]);
  chartReporteSemanal: AgChartOptions | null = null;
  chartFacultades: AgChartOptions | null = null;
  chartType: AgChartOptions | null = null;

  weekly: boolean = true;
  monthly: boolean = false;
  annual: boolean = false;

  setActiveTab(tab: String) {
    this.weekly = tab === 'weekly';
    this.monthly = tab === 'monthly';
    this.annual = tab === 'annual';
  }

  constructor() {
    this.dashboardService.getDataForDashboard();
    this.dashboardService.dashboard$.pipe(takeUntilDestroyed()).subscribe({
      next: (data) => {
        this.summary.set(data?.summary || []);
        this.chartReporteSemanal = {
          subtitle: {
            text: "Casos reportados en la última semana",
          },
          data: data?.reportsByWeekday,
          series: [
            {
              type: "area",
              xKey: "day",
              yKey: "reported",
              strokeWidth: 2,
              fillOpacity: 0.4,
              interpolation: { type: "smooth" },
              fill: "#20cef7",
              stroke: "#00CEFF",
              marker: {
                fill: "#20cef7",
                stroke: "#00CEFF",
                size: 10,
                strokeWidth: 2,
              },
            },
          ],
        };
        this.chartFacultades = {
          data: data?.reportsByFacultad,
          series: [
            {
              type: "pie",
              angleKey: "total",
              calloutLabelKey: "facultad",
              sectorLabelKey: "total",
              fills: ["#3852B4", "#FFC81E", "#FF6D1F", "#48A111", "#2FA4D7", "#DC0000"],
            },
          ],
        },
        this.chartType = {
          data: data?.reportsByType,
          series: [
            {
              type: "bar",
              direction: "horizontal",
              xKey: "quarter",
              yKey: "value",
              fill: "#00CEFF",
              label: { enabled: true },
            }
          ]
        }
      }
    });
  }

  Calendar = faCalendar;
  Clipboard = faClipboardList;
  Week = faCalendarWeek;
  School = faBuilding;
  Types = faChartBar;
}