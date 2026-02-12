export type ImeiItem = {
  imei: string;
  vendor: string;
  paymentStatus: string;
  isSold:boolean;
};

export type AddImeiDialogProps = {
  onSubmit: (data: ImeiItem[]) => void;
  initialData?: ImeiItem[];
};
