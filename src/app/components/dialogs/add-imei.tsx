"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useFetchVendors } from "@/features/vendor/hooks";
import { AddImeiDialogProps, ImeiItem } from "@/app/types/dialog.types";

const defaultRow: ImeiItem = {
  imei: "",
  vendor: "",
  paymentStatus: "Paid",
  isSold:false
};

const AddImeiDialog = ({ onSubmit, initialData }: AddImeiDialogProps) => {
  const { data: vendors } = useFetchVendors();

  const [formData, setFormData] = React.useState<ImeiItem[]>([defaultRow]);

  // Sync initialData (edit mode)
  React.useEffect(() => {
    if (initialData && initialData.length > 0) {
      setFormData(initialData);
    } else {
      setFormData([defaultRow]);
    }
  }, [initialData, open]);

  // Add new row
  const addImeiField = () => {
    setFormData((prev) => [...prev, defaultRow]);
  };

  // Remove row
  const removeField = (index: number) => {
    setFormData((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle change
  const handleChange = (
    index: number,
    field: keyof ImeiItem,
    value: string,
  ) => {
    const updated = [...formData];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setFormData(updated);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-black text-white px-4 py-2 rounded-lg">
          Add IMEI
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />

        <Dialog.Content className="fixed left-1/2 top-1/2 w-[850px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">
            {initialData ? "Edit IMEI Details" : "Add IMEI Details"}
          </Dialog.Title>

          {/* Dynamic Fields */}
          <div className=" max-h-[60vh] overflow-y-auto pr-2">
            {formData.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 items-end p-2 rounded-xl"
              >
                {/* IMEI */}
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    IMEI
                  </label>
                  <input
                    placeholder="Enter IMEI"
                    value={item.imei}
                    onChange={(e) =>
                      handleChange(index, "imei", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>

                {/* Vendor */}
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Vendor
                  </label>
                  <select
                    value={item.vendor}
                    onChange={(e) =>
                      handleChange(index, "vendor", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-slate-50 border rounded-xl"
                  >
                    <option value="">Select Vendor</option>
                    {vendors?.map((v) => (
                      <option key={v._id} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Status */}
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Payment Status
                  </label>
                  <select
                    value={item.paymentStatus}
                    onChange={(e) =>
                      handleChange(index, "paymentStatus", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-slate-50 border rounded-xl"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Not Paid">Not Paid</option>
                  </select>
                </div>

                {/* Remove Button */}
                {formData.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="text-red-500 text-lg px-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Row Button */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={addImeiField}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              + Add Another
            </button>
          </div>

          {/* Save Button */}
          <Dialog.Close asChild>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="border hover:bg-black hover:text-white px-6 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
            </Dialog.Close>
          {/* Close Icon */}
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-gray-500"
              aria-label="Close"
            >
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddImeiDialog;
