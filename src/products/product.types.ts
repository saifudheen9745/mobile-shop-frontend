export interface ProductPayload {
  name?: string;
  model?: string;
  company?: string;
  category?: string;
  actualPrice?: number;
  sellingPrice?: number;
  isUsedProduct?: boolean;
  description?: string;
  attributes?: Record<string, any>;
}
