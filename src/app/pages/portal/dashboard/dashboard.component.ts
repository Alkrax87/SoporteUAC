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
  chartByTimeWeekly: AgChartOptions | null = null;
  chartByTimeMonthly: AgChartOptions | null = null;
  chartByTimeAnnual: AgChartOptions | null = null;
  chartByFacultadWeekly: AgChartOptions | null = null;
  chartByFacultadMonthly: AgChartOptions | null = null;
  chartByFacultadAnnual: AgChartOptions | null = null;
  chartByTypeWeekly: AgChartOptions | null = null;
  chartByTypeMonthly: AgChartOptions | null = null;
  chartByTypeAnnual: AgChartOptions | null = null;

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
        this.chartByTimeWeekly = {
          subtitle: {
            text: "Casos reportados en la última semana",
          },
          data: data?.reportsByTime.weekDays,
          series: [
            {
              type: "area",
              xKey: "key",
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
        }
        this.chartByTimeMonthly = {
          subtitle: {
            text: "Casos reportados en la última semana",
          },
          data: data?.reportsByTime.monthWeeks,
          series: [
            {
              type: "area",
              xKey: "key",
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
        }
        this.chartByTimeAnnual = {
          subtitle: {
            text: "Casos reportados en el último año",
          },
          data: data?.reportsByTime.yearMonths,
          series: [
            {
              type: "area",
              xKey: "key",
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
        }
        this.chartByFacultadWeekly = {
          data: data?.reportsByFacultad.weekDays,
          series: [
            {
              type: "pie",
              angleKey: "value",
              calloutLabelKey: "facultad",
              sectorLabelKey: "value",
              fills: ["#3852B4", "#FFC81E", "#FF6D1F", "#48A111", "#2FA4D7", "#DC0000"],
            },
          ],
        }
        this.chartByFacultadMonthly = {
          data: data?.reportsByFacultad.monthWeeks,
          series: [
            {
              type: "pie",
              angleKey: "value",
              calloutLabelKey: "facultad",
              sectorLabelKey: "value",
              fills: ["#3852B4", "#FFC81E", "#FF6D1F", "#48A111", "#2FA4D7", "#DC0000"],
            },
          ],
        }
        this.chartByFacultadAnnual = {
          data: data?.reportsByFacultad.yearMonths,
          series: [
            {
              type: "pie",
              angleKey: "value",
              calloutLabelKey: "facultad",
              sectorLabelKey: "value",
              fills: ["#3852B4", "#FFC81E", "#FF6D1F", "#48A111", "#2FA4D7", "#DC0000"],
            },
          ],
        }
        this.chartByTypeWeekly = {
          data: data?.reportsByType.weekDays,
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
        this.chartByTypeMonthly = {
          data: data?.reportsByType.monthWeeks,
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
        this.chartByTypeAnnual = {
          data: data?.reportsByType.yearMonths,
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