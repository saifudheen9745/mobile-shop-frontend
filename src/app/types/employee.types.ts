export type EmployeeRole = "ADMIN" | "MANAGER" | "STAFF";

export interface IEmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface IEmployee {
  _id?: string;

  employeeNumber: string;
  name: string;
  phone: string;
  role: EmployeeRole;

  emergencyContact: IEmergencyContact;

  // Optional
  email?: string;
  address?: string;
  salary?: number;
  joiningDate?: string;
  dateOfBirth?: string;
  bloodGroup?: string;

  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
