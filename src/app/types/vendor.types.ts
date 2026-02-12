export interface IVendor {
  _id?: string;

  name: string;
  phone: string;
  address: string;

  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
