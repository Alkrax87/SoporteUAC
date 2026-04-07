import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
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
  imports: [BreadcrumbComponent, FontAwesomeModule, DatePipe, UserLogoutComponent, AgCharts],
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
              fills: ["#168BF5", "#FF7556", "#F2A541", "#29AB91", "#405189", "#7653FF"],
            },
          ],
        }
      }
    });
    this.chartType = {
      data: this.getData3(),
      series: [
        {
          type: "bar",
          direction: "horizontal",
          xKey: "quarter",
          yKey: "value",
          fill: "#D5509C",
          label: { enabled: true  },
        }
      ],
    }
  }

  getData3() {
    return [
      { quarter: "Hardware", value: 10 },
      { quarter: "Software", value: 13 },
      { quarter: "Impresora", value: 5 },
      { quarter: "Red", value: 2 },
      { quarter: "Anexo", value: 1 },
      { quarter: "Accesorios", value: 6 },
      { quarter: "Otros", value: 9 },
    ];
  }

  Calendar = faCalendar;
  Clipboard = faClipboardList;
  Week = faCalendarWeek;
  School = faBuilding;
  Types = faChartBar;
}