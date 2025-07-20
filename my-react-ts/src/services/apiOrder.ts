import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utilities/createBaseQuery.ts";
import type {IOrder, IOrderCreateRequest, IOrderCreateResponse} from "./types.ts";
export const apiOrder = createApi({
    reducerPath: 'api/order',
    baseQuery: createBaseQuery('Order'),
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        getAllOrders: builder.query<IOrder[], void>({
            query: () => 'list',
            providesTags: ['Orders'],
        }),
        getById: builder.query<IOrder, number>({
            query: (id) => `get/${id}`,
        }),
        createOrder: builder.query<IOrderCreateResponse, IOrderCreateRequest>({
            query: (obj) => {
                try {
                    return {
                        url: 'create',
                        method: 'POST',
                        body: obj,
                    };
                } catch {
                    throw new Error('Error Create order');
                }
            },
            invalidatesTags: ['Orders'],
        })
    }),
});


export const {
    useGetAllOrdersQuery,
    useGetByIdQuery,
    useCreateOrderMutation,
} = apiOrder;