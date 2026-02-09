import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICart, ICartContent, ICartProduct } from "@/app/types/cat.types";

const initialState: ICart = {
  selectedCart: "",
  carts: [],
};

const calculateGrandTotal = (cart: ICartContent) => {
  cart.grandTotal = cart.products.reduce(
    (total, product) =>
      total + product.sellingPrice * product.quantity,
    0
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCart(state, action: PayloadAction<ICartContent>) {
      state.carts.push({
        ...action.payload,
        grandTotal: 0,
      });
      state.selectedCart = action.payload.id;
    },

    deleteCart(state, action: PayloadAction<string>) {
      state.carts = state.carts.filter(
        (cart) => cart.id !== action.payload
      );

      if (state.selectedCart === action.payload) {
        state.selectedCart = state.carts[0]?.id || "";
      }
    },

    selectCart(state, action: PayloadAction<string>) {
      state.selectedCart = action.payload;
    },

    addToCart(state, action: PayloadAction<{ product: ICartProduct }>) {
      const cart = state.carts.find(
        (c) => c.id === state.selectedCart
      );
      if (!cart) return;

      const existingProduct = cart.products.find(
        (p) => p._id === action.payload.product._id
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({
          ...action.payload.product,
          quantity: action.payload.product.quantity ?? 1,
        });
      }

      calculateGrandTotal(cart);
    },

    removeFromCart(state, action: PayloadAction<{ productId: string }>) {
      const cart = state.carts.find(
        (c) => c.id === state.selectedCart
      );
      if (!cart) return;

      cart.products = cart.products.filter(
        (p) => p._id !== action.payload.productId
      );

      calculateGrandTotal(cart);
    },

    updateProductQty(
      state,
      action: PayloadAction<{ productId: string; qty: 1 | -1 }>
    ) {
      const cart = state.carts.find(
        (c) => c.id === state.selectedCart
      );
      if (!cart) return;

      const product = cart.products.find(
        (p) => p._id === action.payload.productId
      );
      if (!product) return;

      product.quantity += action.payload.qty;

      if (product.quantity <= 0) {
        cart.products = cart.products.filter(
          (p) => p._id !== action.payload.productId
        );
      }

      calculateGrandTotal(cart);
    },
  },
});

export const {
  addCart,
  deleteCart,
  addToCart,
  removeFromCart,
  selectCart,
  updateProductQty,
} = cartSlice.actions;

export default cartSlice.reducer;
