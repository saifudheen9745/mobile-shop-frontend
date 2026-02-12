import mongoose, { Schema } from "mongoose";
import type { IExpense } from "./expense.types.js";

const expenseSchema = new Schema<IExpense>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: [
        "SALARY",
        "RENT",
        "UTILITY",
        "REFRESHMENT",
        "TRANSPORT",
        "MAINTENANCE",
        "MISCELLANEOUS",
      ],
      required: true,
      index: true,
    },
    expenseDateTime: {
      type: Date,
      required: true,
      index: true,
    },
    paymentMode: {
      type: String,
      enum: ["CASH", "UPI", "CARD", "BANK_TRANSFER"],
      required: true,
    },

    // Relations
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required:false
    },

    // Descriptive
    description: { type: String, trim: true },
    paidTo: { type: String, trim: true },
    referenceId: { type: String, trim: true },

    // Reporting
    month: { type: String, index: true }, // YYYY-MM
    notes: { type: String },

    // Audit
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const ExpenseModel = mongoose.model<IExpense>(
  "Expense",
  expenseSchema
);
