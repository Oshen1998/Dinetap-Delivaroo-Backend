export interface ReportQuery {
  status?: string[];
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}
