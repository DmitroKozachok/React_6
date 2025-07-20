// import type {ICart, ICartItem, IRemoveCartItem} from "../services/types.ts";
// import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
// import type {RootState} from "./index.ts";
//
// interface CartState {
//     localCart: ICart;
// }
//
// const initialState: CartState = {
//     localCart: JSON.parse(localStorage.getItem('cart') || '{}')
// };
//
// const cartSlice = createSlice({
//     name: 'cart',
//     initialState,
//     reducers: {
//
//         createUpdateCartLocal: (state, action: PayloadAction<ICartItem>) => {
//             const newItem = action.payload;
//
//             if (!state.localCart.items) {
//                 state.localCart.items = [];
//             }
//
//             const index = state.localCart.items!.findIndex(cartItem => cartItem.productId === newItem.productId);
//
//             if (index >= 0) {
//                 state.localCart.items[index].quantity! = newItem.quantity!;
//
//                 if (state.localCart.items[index].quantity! <= 0) {
//                     state.localCart.items.splice(index, 1);
//                 }
//             } else {
//                 state.localCart.items.push(newItem);
//             }
//
//             localStorage.setItem('cart', JSON.stringify(state.localCart));
//         },
//
//         removeCartItemLocal: (state, action: PayloadAction<IRemoveCartItem>) => {
//             const removeCart = action.payload;
//
//             state.localCart.items = state.localCart.items.filter(el  => el.productId != removeCart.id);
//             localStorage.setItem('cart', JSON.stringify(state.localCart));
//             },
//
//         clearLocalCartLocal: (state) => {
//             state.localCart.items = [];
//             localStorage.removeItem('cart');
//         },
//     },
// });
//
// export const {
//     createUpdateCartLocal,
//     removeCartItemLocal,
//     clearLocalCartLocal
// } = cartSlice.actions;
//
// export const selectLocalCart = (state: RootState) => state.cart.localCart;
//
// export default cartSlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ICartItem {
    id?: number;
    productId?: number;
    categoryId?: number;
    name?: string;
    categoryName?: string;
    quantity?: number;
    price?: number;
    sizeName?: string;
    imageName?: string;
}

export  interface ICartState {
    items: ICartItem[];
    totalPrice: number;
    isSync: boolean;
}


const initialState: ICartState = {
    items: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!) : [],
    totalPrice: 0,
    isSync: false,
}


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        createUpdateCart: (state, action: PayloadAction<ICartItem[]>) => {
            state.items = action.payload;
        },
    },
});

export const {createUpdateCart} = cartSlice.actions;


export default cartSlice.reducer;
