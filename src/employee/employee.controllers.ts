import type { Request, Response } from "express";
import { EmployeeService } from "./employee.services.js";

export class EmployeeController {
  static async createEmployee(req: Request, res: Response) {
    try {
      const {
        employeeNumber,
        name,
        phone,
        role,
        emergencyContact,
      } = req.body;

      if (
        !employeeNumber ||
        !name ||
        !phone ||
        !role ||
        !emergencyContact?.name ||
        !emergencyContact?.phone ||
        !emergencyContact?.relation
      ) {
        return res.status(400).json({
          message:
            "employeeNumber, name, phone, role and emergencyContact (name, phone, relation) are required",
        });
      }

      const employee = await EmployeeService.createEmployee(req.body);

      return res.status(201).json(employee);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async getEmployees(req: Request, res: Response) {
    try {
      const employees = await EmployeeService.getEmployees();
      return res.json(employees);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getEmployeeById(req: Request, res: Response) {
    try {
      const employee = await EmployeeService.getEmployeeById(req.params.id as string);
      return res.json(employee);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  static async updateEmployee(req: Request, res: Response) {
    try {
      const employee = await EmployeeService.updateEmployee(
        req.params.id as string,
        req.body
      );

      return res.json(employee);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async deleteEmployee(req: Request, res: Response) {
    try {
      await EmployeeService.deleteEmployee(req.params.id as string);
      return res.json({ message: "Employee deleted successfully" });
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
}
