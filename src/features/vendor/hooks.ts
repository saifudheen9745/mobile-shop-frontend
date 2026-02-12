import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from "./api";
import { IVendor } from "@/app/types/vendor.types";


export function useFetchVendors() {
  return useQuery<IVendor[]>({
    queryKey: ["vendors"],
    queryFn: fetchVendors,
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}

export function useUpdateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      vendorId: string;
      payload: Partial<IVendor>;
    }) => updateVendor(data.vendorId, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}

export function useDeleteVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vendorId: string) => deleteVendor(vendorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}
