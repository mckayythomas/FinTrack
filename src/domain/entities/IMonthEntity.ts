export interface IMonthEntity {
  _id?: string;
  yearId: string;
  month: number;
  totalIncome?: number;
  totalExpenses?: number;
  createdAt?: number;
  updatedAt?: number;
}
