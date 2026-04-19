import { ReportByTime, ReportsByFacultad, ReportsByType } from "./dashboard";
import { Reporte } from "./reporte";

export interface Excel {
  total: number;
  reportes: Reporte[];
  dataByType: ReportsByType[];
  dataByFacultad: ReportsByFacultad[];
  dataByWeeks: ReportByTime[];
}