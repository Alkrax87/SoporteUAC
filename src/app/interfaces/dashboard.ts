export interface Summary {
  label: string;
  value: number;
  difference: number;
}
export interface ReportByTime {
  key: string;
  reported: number;
}
export interface ReportsByFacultad {
  facultad: string;
  value: number;
}
export interface ReportsByType {
  quarter: string;
  value: number;
}
export interface DashboardData {
  summary: Summary[];
  reportsByTime: {
    weekDays: ReportByTime[];
    monthWeeks: ReportByTime[];
    yearMonths: ReportByTime[];
  },
  reportsByFacultad: {
    weekDays: ReportsByFacultad[];
    monthWeeks: ReportsByFacultad[];
    yearMonths: ReportsByFacultad[];
  },
  reportsByType: {
    weekDays: ReportsByType[];
    monthWeeks: ReportsByType[];
    yearMonths: ReportsByType[];
  },
}