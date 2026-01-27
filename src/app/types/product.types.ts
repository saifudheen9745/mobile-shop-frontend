export interface IProduct {
    _id: string;
  name: string;
  model: string;
  company:string;
  category: string;
  actualPrice: number;
  sellingPrice: number;
  description:string;
  isUsedProduct: boolean;
  attributes?: Record<string, any>;
}


export interface ProductPayload {
  name: string;
  model: string;
  company: string;
  category: string;
  actualPrice: number;
  sellingPrice: number;
  description:string;
  isUsedProduct: boolean;
  attributes?: Record<string, any>;
}
