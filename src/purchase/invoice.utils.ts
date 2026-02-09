export const generateInvoiceNumber = (): string => {
  const ts = Date.now();
  return `INV-${ts}`;
};
