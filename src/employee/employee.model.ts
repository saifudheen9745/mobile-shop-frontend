import mongoose, { Schema } from "mongoose";
import type { IEmployee } from "./employee.types.js";

const emergencyContactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    relation: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const employeeSchema = new Schema<IEmployee>(
  {
    employeeNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "STAFF"],
      required: true,
    },
    emergencyContact: {
      type: emergencyContactSchema,
      required: true,
    },

    // Optional fields
    email: { type: String, lowercase: true, trim: true },
    address: { type: String, trim: true },
    salary: { type: Number, min: 0 },
    joiningDate: { type: Date, default: Date.now },
    dateOfBirth: { type: Date },
    bloodGroup: { type: String },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const EmployeeModel = mongoose.model("Employee", employeeSchema);
