import { ICartContent } from "@/app/types/cat.types";
import { IProduct } from "@/app/types/product.types";

export const getReservedQuantities = (carts: ICartContent[]) => {
  const reservedMap: Record<string, number> = {};

  carts.forEach((cart) => {
    cart.products.forEach((product) => {
      reservedMap[product._id] =
        (reservedMap[product._id] || 0) + product.quantity;
    });
  });

  return reservedMap;
};


export const adjustProductsByCart = (
  products: IProduct[],
  carts: ICartContent[]
) => {
  const reservedMap = getReservedQuantities(carts);

  return products?.map((product) => {
    const reservedQty = reservedMap[product._id] || 0;

    return {
      ...product,
      availableQuantity: Math.max(
        product.quantity - reservedQty,
        0
      ),
    };
  });
};

