import { EmployeeModel } from "./employee.model.js";
import type { IEmployee } from "./employee.types.js";

export class EmployeeService {
  static async createEmployee(data: IEmployee) {
    try {
      const exists = await EmployeeModel.exists({
        $or: [
          { phone: data.phone },
          { employeeNumber: data.employeeNumber },
        ],
      });

      if (exists) {
        throw new Error(
          "Employee already exists with phone or employee number"
        );
      }

      return await EmployeeModel.create(data);
    } catch (error) {
      throw error;
    }
  }

  static async getEmployees() {
    try {
      return await EmployeeModel.find({ isActive: true }).sort({
        createdAt: -1,
      });
    } catch (error) {
      throw error;
    }
  }

  static async getEmployeeById(id: string) {
    try {
      const employee = await EmployeeModel.findById(id);
      if (!employee) {
        throw new Error("Employee not found");
      }
      return employee;
    } catch (error) {
      throw error;
    }
  }

  static async updateEmployee(id: string, data: Partial<IEmployee>) {
    try {
      const employee = await EmployeeModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!employee) {
        throw new Error("Employee not found");
      }

      return employee;
    } catch (error) {
      throw error;
    }
  }

  static async deleteEmployee(id: string) {
    try {
      const employee = await EmployeeModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!employee) {
        throw new Error("Employee not found");
      }

      return employee;
    } catch (error) {
      throw error;
    }
  }
}
