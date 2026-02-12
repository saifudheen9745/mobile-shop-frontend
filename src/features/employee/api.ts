// Employee APIs

import { IEmployee } from "@/app/types/employee.types";
import { api } from "@/lib/api";


export function fetchEmployees() {
  return api("/employees", {
    method: "GET",
  });
}

export function createEmployee(payload: IEmployee) {
  return api("/employees", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateEmployee(
  employeeId: string,
  payload: Partial<IEmployee>
) {
  return api(`/employees/${employeeId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteEmployee(employeeId: string) {
  return api(`/employees/${employeeId}`, {
    method: "DELETE",
  });
}
