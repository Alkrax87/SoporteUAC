export interface Summary {
  label: string;
  value: number;
  difference: number;
}

export interface ReportsByFacultad {
  facultad: string;
  total: number;
}

export interface ReportByWeekday {
  day: string;
  reported: number;
}

export interface DashboardData {
  summary: Summary[];
  reportsByWeekday: ReportByWeekday[];
  reportsByFacultad: ReportsByFacultad[];
}