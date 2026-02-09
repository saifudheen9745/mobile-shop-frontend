"use client";

import React, { use, useState } from "react";
import {
  Search,
  ShoppingCart,
  ShoppingBag,
  Phone,
  Trash2,
  Eye,
  Check,
  List,
  Minus,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { SideDrawer } from "@/app/components/side-dialog/side-drawer";
import { DrawerOverlayContainer } from "@/app/components/drawer-overlay-container/drawer-overlay-container";

import {
  useFetchProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/features/product/hooks";

import { useFetchCategories } from "@/features/category/hooks";
import type { IProduct } from "@/app/types/product.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  addCart,
  addToCart,
  deleteCart,
  removeFromCart,
  selectCart,
  updateProductQty,
} from "@/store/cart.slice";
import { ICart, ICartContent, ICartProduct } from "@/app/types/cat.types";
import { adjustProductsByCart } from "@/lib/utils";
import { useCreatePurchase } from "@/features/purchase/hooks";
import { CreatePurchaseInput } from "@/app/types/purchase.types";

const Sales = () => {
  const { data: products } = useFetchProducts();
  const { data: categories } = useFetchCategories();

  const { mutate: createProduct } = useCreateProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const { mutate: createPurchase } = useCreatePurchase();

  const queryClient = useQueryClient();

  const reduxDispatch = useDispatch();
  const { carts, selectedCart } = useSelector((state: RootState) => state.cart);

  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [openCreateCartDrawer, setOpenCreateCartDrawer] = useState(false);
  const [openShoppingCartDrawer, setOpenShoppingCartDrawer] = useState(false);
  const [openSelectedCartDrawer, setOpenSelectedCartDrawer] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<IProduct | null>(null);

  const [createCartFormData, setCreateCartFormData] = useState({
    user: "",
    phone: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    model: "",
    company: "",
    category: "",
    actualPrice: "",
    sellingPrice: "",
    description: "",
    isUsedProduct: false,
    quantity: "",
    attributes: {
      storage: "",
      ram: "",
      color: "",
      purchasedFrom: "",
      purchaseDate: "",
      imei1: "",
      imei2: "",
    },
  });

  const filteredProducts = products?.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p._id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const qtyCalculatedProducts = adjustProductsByCart(
    filteredProducts as IProduct[],
    carts,
  );

  const openCreateDrawer = () => {
    setEditMode(false);
    setSelected(null);
    setFormData({
      name: "",
      model: "",
      company: "",
      category: "",
      actualPrice: "",
      sellingPrice: "",
      description: "",
      isUsedProduct: false,
      quantity: "",
      attributes: {
        storage: "",
        ram: "",
        color: "",
        purchasedFrom: "",
        purchaseDate: "",
        imei1: "",
        imei2: "",
      },
    });
    setOpen(true);
  };

  const openNewCartDrawer = () => {
    setCreateCartFormData({
      user: "",
      phone: "",
    });
    setOpenCreateCartDrawer(true);
  };

  const openShoppingCartDrawerFn = () => {
    setOpenShoppingCartDrawer(true);
  };

  const viewSelectedCart = () => {
    const cart = carts.find((c) => c.id === selectedCart);
  };

  const openEditDrawer = (product: IProduct) => {
    setEditMode(true);
    setSelected(product);
    setFormData({
      name: product.name,
      model: product.model,
      company: product.company,
      category: product.category,
      actualPrice: product.actualPrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      description: product.description || "",
      isUsedProduct: product.isUsedProduct || false,
      quantity: product.quantity.toString(),
      attributes: {
        storage: product.attributes?.storage || "",
        ram: product.attributes?.ram || "",
        color: product.attributes?.color || "",
        purchasedFrom: product.attributes?.purchasedFrom || "",
        purchaseDate: product.attributes?.purchaseDate || "",
        imei1: product.attributes?.imei1 || "",
        imei2: product.attributes?.imei2 || "",
      },
    });
    setOpen(true);
  };

  const deleteProductFn = (id: string) => {
    deleteProduct(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      model: formData.model,
      company: formData.company,
      category: formData.category,
      actualPrice: Number(formData.actualPrice),
      sellingPrice: Number(formData.sellingPrice),
      description: formData.description,
      isUsedProduct: formData.isUsedProduct,
      quantity: parseInt(formData.quantity),
      attributes: formData.attributes,
    };

    if (editMode && selected) {
      updateProduct(
        { productId: selected._id, payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            setOpen(false);
          },
        },
      );
      return;
    }

    createProduct(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        setOpen(false);
      },
    });
  };

  const createCart = (e: React.FormEvent) => {
    e.preventDefault();
    const newCartId = `CART-${Math.floor(100000 + Math.random() * 900000)}`;
    reduxDispatch(
      addCart({
        id: newCartId,
        user: createCartFormData.user,
        phone: createCartFormData.phone,
        grandTotal: 0,
        products: [],
      }),
    );
    setCreateCartFormData({
      user: "",
      phone: "",
    });
    setOpenCreateCartDrawer(false);
  };

  const selectACart = (cartId: string) => {
    reduxDispatch(selectCart(cartId));
  };

  const deleteCartFn = (cartId: string) => {
    reduxDispatch(deleteCart(cartId));
  };

  const addToCartFn = (product: IProduct & { availableQuantity: number }) => {
    if (product.availableQuantity === 0) {
      return;
    }
    if (carts.length === 0) {
      setOpenCreateCartDrawer(true);
    }
    const cartItem: ICartProduct = {
      _id: product._id,
      name: product.name,
      quantity: 1,
      sellingPrice: product.sellingPrice,
      total: product.sellingPrice,
    };
    reduxDispatch(addToCart({ product: cartItem }));
  };

  const deleteFromCartFn = (id: string) => {
    reduxDispatch(removeFromCart({ productId: id }));
  };

  const updateProductQtyInCart = (
    qty: 1 | -1,
    product: IProduct & { availableQuantity: number },
  ) => {
    if (product.availableQuantity === 0 && qty === 1) {
      return;
    }
    reduxDispatch(updateProductQty({ productId: product._id, qty }));
  };

  const doPurcase = () => {
    const cartDetails = carts.filter((c) => c.id === selectedCart)[0];
    const purchaseObj: CreatePurchaseInput = {
      user: cartDetails.user,
      phone: cartDetails.phone,
      products: cartDetails.products.map((p) => ({
        productId: p._id, // or p.productId if that's the key in cart
        quantity: p.quantity,
      })),
      paymentMethod: "CASH",
    };

    createPurchase(purchaseObj,{
      onSuccess: () => {
         deleteCartFn(selectedCart);
         queryClient.invalidateQueries({ queryKey: ["purchase"] });
         setOpenSelectedCartDrawer(false);
      }
    });
  };

  return (
    <DrawerOverlayContainer>
      {(container) => (
        <div className="flex flex-col h-full bg-[#F8FAFC] p-8">
          {/* HEADER */}
          <div className="flex mb-8 w-full items-center justify-between">
            {/* LEFT SECTION */}
            <div className="w-1/2">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Sales
              </h1>
              <p className="text-slate-500 mt-1">
                Smart Choices for Smart Users.
              </p>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex  items-center justify-center gap-3 p-2 px-3 rounded-xl  bg-gray-100 ">
              <button
                onClick={() => {
                  if (carts.length === 0) {
                    setOpenCreateCartDrawer(true);
                  } else {
                    setOpenSelectedCartDrawer(true);
                  }
                }}
                className="font-mono text-cyan-600 hover:bg-cyan-50 px-2 py-1 rounded text-base font-semibold inline-block cursor-pointer"
              >
                {selectedCart ? `Cart: ${selectedCart}` : "Select Cart"}
              </button>

              <button
                onClick={openNewCartDrawer}
                className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                <ShoppingBag size={22} />
                Create Cart
              </button>
              <button
                onClick={openShoppingCartDrawerFn}
                className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                <List size={22} />
              </button>
            </div>
          </div>

          {/* SEARCH */}
          <div className="bg-white p-4 rounded-2xl shadow-sm  flex gap-4 items-center mb-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                placeholder="Search by name, model, or ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <p className="text-sm text-slate-500 whitespace-nowrap">
              {filteredProducts?.length || 0} Products Total
            </p>
          </div>

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative z-0 flex flex-col">
            <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-[5] border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400 w-12 text-center">
                      #
                    </th>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                      Name
                    </th>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                      Model
                    </th>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                      Company
                    </th>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                      Category
                    </th>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                      Price
                    </th>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                      Quantity
                    </th>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                      Is Used
                    </th>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {/* Using this instead of filter variable to get adjusted qty value of each product relative to cart items */}
                  {qtyCalculatedProducts?.map((p, i) => (
                    <tr
                      key={p._id}
                      className="group hover:bg-slate-50/50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-medium text-slate-400">
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900 leading-tight">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-600 bg-slate-100/50 px-2 py-1 rounded-md">
                          {p.model}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-600 bg-slate-100/50 px-2 py-1 rounded-md">
                          {p.company}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {p.category}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-800 tracking-tight">
                          ₹{Number(p.actualPrice).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium text-center">
                        {p.availableQuantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium text-center">
                        {p.attributes?.isUsedProduct ? "Yes" : "No"}
                      </td>
                      <td className="px-6 py-4 ">
                        <div className="flex justify-end items-center gap-1 ">
                          <button
                            onClick={() => addToCartFn(p)}
                            className="flex items-center justify-center  gap-2 bg-[#0F172A] cursor-pointer text-white px-3 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-50"
                          >
                            <ShoppingCart size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DRAWER */}
          <SideDrawer
            open={open}
            onOpenChange={setOpen}
            title={editMode ? "Update Product" : "Create Product"}
            container={container}
            overlay
            closeFn={(val: boolean) => setOpen(val)}
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col h-full justify-between space-y-6 max-w-xl"
            >
              <div className="flex-1 overflow-y-auto pr-2 space-y-5 pt-2">
                {/* Category */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Used / Second-hand toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="secondHand"
                    checked={formData.isUsedProduct}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isUsedProduct: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="secondHand"
                    className="text-sm font-medium text-slate-700"
                  >
                    Second Hand / Used Product
                  </label>
                </div>

                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Product Name
                  </label>
                  <input
                    required
                    placeholder="Enter product name"
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* Model + Company */}
                <div className="flex gap-3">
                  <div className="space-y-1 flex-1">
                    <label className="text-sm font-medium text-slate-700">
                      Model
                    </label>
                    <input
                      required
                      placeholder="Model number"
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1 flex-1">
                    <label className="text-sm font-medium text-slate-700">
                      Company
                    </label>
                    <input
                      required
                      placeholder="Apple, Samsung..."
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Prices */}
                <div className="flex gap-3">
                  <div className="space-y-1 flex-1">
                    <label className="text-sm font-medium text-slate-700">
                      Actual Price
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="₹"
                      value={formData.actualPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          actualPrice: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div className="space-y-1 flex-1">
                    <label className="text-sm font-medium text-slate-700">
                      Selling Price
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="₹"
                      value={formData.sellingPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sellingPrice: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div className="space-y-1 flex-1">
                    <label className="text-sm font-medium text-slate-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Qty"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                </div>

                {/* Mobile-specific fields */}
                {formData.category.toLowerCase() === "mobile" && (
                  <div className="space-y-3">
                    {/* Storage + RAM */}
                    <div className="flex gap-3">
                      <div className="space-y-1 flex-1">
                        <label className="text-sm font-medium text-slate-700">
                          Storage
                        </label>
                        <input
                          required
                          placeholder="128GB"
                          value={formData.attributes.storage}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              attributes: {
                                ...formData.attributes,
                                storage: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                        />
                      </div>

                      <div className="space-y-1 flex-1">
                        <label className="text-sm font-medium text-slate-700">
                          RAM
                        </label>
                        <input
                          required
                          placeholder="6GB"
                          value={formData.attributes.ram}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              attributes: {
                                ...formData.attributes,
                                ram: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                        />
                      </div>
                    </div>

                    {/* IMEIs */}
                    {/* <div className="flex gap-3">
                      <div className="space-y-1 flex-1">
                        <label className="text-sm font-medium text-slate-700">
                          IMEI 1
                        </label>
                        <input
                          placeholder="IMEI 1"
                          value={formData.attributes.imei1}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              attributes: {
                                ...formData.attributes,
                                imei1: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                        />
                      </div>

                      <div className="space-y-1 flex-1">
                        <label className="text-sm font-medium text-slate-700">
                          IMEI 2
                        </label>
                        <input
                          placeholder="IMEI 2"
                          value={formData.attributes.imei2}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              attributes: {
                                ...formData.attributes,
                                imei2: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                        />
                      </div>
                    </div> */}

                    {/* Color */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">
                        Color
                      </label>
                      <input
                        placeholder="Color"
                        value={formData.attributes.color}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            attributes: {
                              ...formData.attributes,
                              color: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {/* Second hand fields */}
                {formData.isUsedProduct && (
                  <div className="flex gap-3">
                    <div className="space-y-1 flex-1">
                      <label className="text-sm font-medium text-slate-700">
                        Purchased From
                      </label>
                      <input
                        required
                        placeholder="Vendor / Customer"
                        value={formData.attributes.purchasedFrom}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            attributes: {
                              ...formData.attributes,
                              purchasedFrom: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>

                    <div className="space-y-1 flex-1">
                      <label className="text-sm font-medium text-slate-700">
                        Purchase Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.attributes.purchaseDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            attributes: {
                              ...formData.attributes,
                              purchaseDate: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Product Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Optional notes about condition, accessories, box, warranty..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="border-t pt-5 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#0F172A] text-white py-3 rounded-xl"
                >
                  {editMode ? "Update Product" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </SideDrawer>
          <SideDrawer
            open={openCreateCartDrawer}
            onOpenChange={(val) => {
              setOpenShoppingCartDrawer(val);
            }}
            title="Create New Cart"
            container={container}
            overlay={true}
            closeFn={(val: boolean) => setOpenCreateCartDrawer(val)}
          >
            <form
              onSubmit={createCart}
              className="flex flex-col h-full justify-between"
            >
              <div className="flex-1 space-y-6">
                <p className="text-sm text-slate-500">
                  One Cart. Endless Choices
                </p>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Name
                  </label>
                  <input
                    required
                    value={createCartFormData.user}
                    onChange={(e) =>
                      setCreateCartFormData({
                        ...createCartFormData,
                        user: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Phone
                  </label>
                  <input
                    required
                    value={createCartFormData.phone}
                    onChange={(e) =>
                      setCreateCartFormData({
                        ...createCartFormData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="shrink-0 border-t pt-5 flex gap-3 bg-white">
                <button
                  type="submit"
                  className="flex-1 bg-[#0F172A] text-white py-3 rounded-xl"
                >
                  Create Cart
                </button>
                <button
                  type="button"
                  onClick={() => setOpenCreateCartDrawer(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </SideDrawer>
          <SideDrawer
            open={openShoppingCartDrawer}
            onOpenChange={(val) => setOpenShoppingCartDrawer(val)}
            title="Available Shopping Carts"
            container={container}
            overlay={true}
            closeFn={(val: boolean) => setOpenShoppingCartDrawer(val)}
          >
            <div className="p-2">
              <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Cart ID</th>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {/* Mock Data - Map your real carts state here */}
                    {carts.map((cart) => (
                      <tr
                        key={cart.id}
                        className={`hover:bg-slate-50 transition-colors`}
                      >
                        <td className="px-4 py-4">
                          <div
                            className={`font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded text-[12px] inline-block ${cart.id === selectedCart && "bg-green-100"}`}
                          >
                            {cart.id}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-semibold text-slate-800">
                            {cart.user}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-semibold text-slate-800">
                            {cart.phone}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right flex items-center justify-center gap-1">
                          {/* <button className="p-2 text-slate-400 hover:text-cyan-600">
                            <Eye size={20} />
                          </button> */}
                          <button
                            onClick={() => {
                              // Logic to select cart
                              selectACart(cart.id);
                              setOpenShoppingCartDrawer(false);
                            }}
                            className="p-2 text-slate-400 hover:text-green-900"
                          >
                            <Check size={22} />
                          </button>
                          <button
                            onClick={() => deleteCartFn(cart.id)}
                            className="p-2 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Helper text for empty states */}
              <p className="text-center text-slate-400 text-xs mt-6">
                Showing all active carts
              </p>
            </div>
          </SideDrawer>
          <SideDrawer
            open={openSelectedCartDrawer}
            onOpenChange={(val) => {
              setOpenSelectedCartDrawer(val);
            }}
            title={`Cart Details - ${selectedCart}`}
            container={container}
            overlay={true}
            closeFn={(val: boolean) => setOpenSelectedCartDrawer(val)}
          >
            <div className="flex flex-col h-full bg-white">
              {/* Scrollable Table Area */}
              <div className="flex-1 p-4 overflow-auto">
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[12px] font-bold tracking-wider sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 border-b border-slate-200">
                          No
                        </th>
                        <th className="px-4 py-3 border-b border-slate-200">
                          Product
                        </th>
                        <th className="px-4 py-3 text-center border-b border-slate-200">
                          Qty
                        </th>
                        <th className="px-4 py-3 border-b border-slate-200">
                          Price
                        </th>
                        <th className="px-4 py-3 border-b border-slate-200">
                          Total
                        </th>
                        <th className="px-4 py-3 text-center border-b border-slate-200">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {carts
                        .find((c) => c.id === selectedCart)
                        ?.products.map((p, i) => (
                          <tr
                            key={p._id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-4 py-4 text-slate-500 font-medium">
                              {i + 1}
                            </td>
                            <td className="px-4 py-4 font-semibold text-slate-800">
                              {p.name}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() =>
                                    updateProductQtyInCart(
                                      -1,
                                      qtyCalculatedProducts.filter(
                                        (pr) => pr._id === p._id,
                                      )[0],
                                    )
                                  }
                                  className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                  <MinusCircle size={18} />
                                </button>
                                <span className="w-6 text-center font-bold text-slate-700">
                                  {p.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateProductQtyInCart(
                                      1,
                                      qtyCalculatedProducts.filter(
                                        (pr) => pr._id === p._id,
                                      )[0],
                                    )
                                  }
                                  className="p-1 text-slate-400 hover:text-green-600 transition-colors"
                                >
                                  <PlusCircle size={18} />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-slate-600">
                              ₹{p.sellingPrice.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 font-bold text-slate-900">
                              {Number(
                                p.sellingPrice * p.quantity,
                              ).toLocaleString("en-IN", {
                                style: "currency",
                                currency: "INR",
                              })}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <button
                                onClick={() => deleteFromCartFn(p._id)}
                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-center text-slate-400 text-xs mt-4 italic">
                  Scroll to view more items
                </p>
              </div>

              {/* Fixed Total Summary Footer */}
              <div className="border-t border-slate-200 bg-slate-50 p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-slate-500 text-sm font-medium">
                    <span>Subtotal</span>
                    <span>
                      ₹
                      {carts
                        .filter((c) => c.id === selectedCart)[0]
                        ?.grandTotal?.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-sm font-medium">
                    <span>Tax (0%)</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between items-end pt-2 border-t border-slate-200">
                    <span className="text-slate-800 font-bold text-lg">
                      Grand Total
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#0f172a]">
                        ₹
                        {carts
                          .filter((c) => c.id === selectedCart)[0]
                          ?.grandTotal?.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={doPurcase}
                    className="w-full bg-[#0f172a] text-white py-3 rounded-lg font-bold mt-4 hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                  >
                    Complete Sale
                  </button>
                </div>
              </div>
            </div>
          </SideDrawer>
        </div>
      )}
    </DrawerOverlayContainer>
  );
};

export default Sales;
