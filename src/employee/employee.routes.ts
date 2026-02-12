import { Router } from "express";
import { EmployeeController } from "./employee.controllers.js";

const router = Router();

/**
 * Create employee
 * POST /api/employees
 */
router.post("/", EmployeeController.createEmployee);

/**
 * Get all active employees
 * GET /api/employees
 */
router.get("/", EmployeeController.getEmployees);

/**
 * Get employee by ID
 * GET /api/employees/:id
 */
router.get("/:id", EmployeeController.getEmployeeById);

/**
 * Update employee
 * PUT /api/employees/:id
 */
router.put("/:id", EmployeeController.updateEmployee);

/**
 * Soft delete employee
 * DELETE /api/employees/:id
 */
router.delete("/:id", EmployeeController.deleteEmployee);

export default router;
