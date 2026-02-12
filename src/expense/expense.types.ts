import { Types } from "mongoose";

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
  amount: number;
  category: ExpenseCategory;
  expenseDateTime: Date;
  paymentMode: PaymentMode;

  // Relations
  employeeId?: Types.ObjectId;
  vendorId?: Types.ObjectId;

  // Descriptive
  description?: string;
  paidTo?: string;
  referenceId?: string;

  // Reporting
  month?: string; // YYYY-MM
  notes?: string;

  // Audit
  createdBy?: Types.ObjectId;

  // System
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
