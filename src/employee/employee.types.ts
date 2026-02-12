export type EmployeeRole = "ADMIN" | "MANAGER" | "STAFF";

export interface IEmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface IEmployee {
  employeeNumber: string;
  name: string;
  phone: string;
  role: EmployeeRole;

  emergencyContact: IEmergencyContact;

  // Optional
  email?: string;
  address?: string;
  salary?: number;
  joiningDate?: Date;
  dateOfBirth?: Date;
  bloodGroup?: string;

  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
