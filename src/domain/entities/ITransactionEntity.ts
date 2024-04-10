export interface ITransactionEntity {
  _id?: string;
  monthId: string;
  name: string;
  type: "income" | "expense";
  amount: number;
  date: number | Date | string;
  location: string;
  description?: string;
  category:
    | "housing"
    | "transportation"
    | "food"
    | "utilities"
    | "healthcare"
    | "insurance"
    | "household supplies"
    | "personal"
    | "education"
    | "entertainment"
    | "other"
    | "salary"
    | "commission"
    | "bonus"
    | "gifts"
    | "dividend";
  customCategory?: string;
  createdAt?: number;
  updatedAt?: number;
}
