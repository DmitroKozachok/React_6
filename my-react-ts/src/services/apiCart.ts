import {createApi} from "@reduxjs/toolkit/query/react";
import type {ICart, ICreateUpdateCartItem, IRemoveCartItem} from "./types.ts";
import {createBaseQuery} from "../utilities/createBaseQuery.ts";
import {createUpdateCart} from "../store/cartSlice.ts";
// import {createUpdateCart} from "../store/cartSlice.ts";


export const apiCart = createApi({
    reducerPath: 'apiCart',
    baseQuery: createBaseQuery('Cart'),
    tagTypes: ["Carts"],
    endpoints: (builder) => ({
        getCart: builder.query<ICart, void>({
            query: () => ({
                url: 'getCart',
                method: 'GET'
            }),
            providesTags: ['Carts'],
            async onQueryStarted(_, {dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    // console.log("Get user items", result.data)
                    if(result.data && result.data.items) {
                        dispatch(createUpdateCart(result.data.items));
                    }
                } catch (error) {
                    console.log("getCart fail", error);
                }
            },
        }),

        createUpdateCart: builder.mutation<void, ICreateUpdateCartItem>({
            query: (item) => {
                try {
                    return {
                        url: 'createUpdate',
                        method: 'POST',
                        body: item,
                    };
                } catch {
                    throw new Error('Error add item to cart');
                }
            },
            invalidatesTags: ["Carts"]
        }),
        removeCartItem: builder.mutation<void, IRemoveCartItem>({
            query: (item) => {
                try {
                    return {
                        url: `removeCartItem/${item.id}`,
                        method: 'PUT'
                    };
                } catch {
                    throw new Error('Error remove item from cart');
                }
            },
            invalidatesTags: ["Carts"]
        }),
    })
});


export const {
    useGetCartQuery,
    useCreateUpdateCartMutation,
    useRemoveCartItemMutation
} = apiCart;