export type ExpenseCategory =
  | "SALARY"
  | "RENT"
  | "UTILITY"
  | "REFRESHMENT"
  | "TRANSPORT"
  | "MAINTENANCE"
  | "MISCELLANEOUS";

export type PaymentMode =
  | "CASH"
  | "UPI"
  | "CARD"
  | "BANK_TRANSFER";

export interface IExpense {
  _id?: string;

  amount: number;
  category: ExpenseCategory;
  expenseDateTime: string; // ISO string from backend
  paymentMode: PaymentMode;

  employeeId?: string;
  vendorId?: string;

  description?: string;
  paidTo?: string;
  referenceId?: string;

  month?: string;
  notes?: string;

  createdBy?: string;

  createdAt?: string;
  updatedAt?: string;
}
