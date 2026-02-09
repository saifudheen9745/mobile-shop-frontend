import { IProduct } from './product.types';

export interface ICart {
    selectedCart: string;
    carts: ICartContent[];
}

export interface ICartContent {
    id: string;
    user:string;
    phone:string;
    grandTotal:number;
    products:ICartProduct[]
}

export interface ICartProduct {
    _id: string;
    name: string;
    quantity: number;
    sellingPrice: number;
    total: number;
}