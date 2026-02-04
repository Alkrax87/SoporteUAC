export interface Reporte {
  _id: string | undefined;
  report: string;
  description: string;
  type: string;
  school: string;
  office: string;
  time: string;
  patrimonialCode: string;
  date: Date;
}