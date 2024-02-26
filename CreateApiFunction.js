// Please create a React Toolkit Query createApi function call
// that implements the two endpoints that you find in this gist:
// https://gist.github.com/FerdinandvHagen/ce5a939da313c6a8dfe2ad006fd11d9c


// First, we import the functions we will need from redux toolkit

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// As for making a cleaner code we make a constant for the base url, in this case, the gist provided

const BASE_URL = 'https://gist.github.com/FerdinandvHagen/ce5a939da313c6a8dfe2ad006fd11d9c';

// It's time to create the order API
const orderApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: ['Order'],
    endpoints: (build) => ({
        
        getOrder: build.query({
            // Defines the endpoint URL for retrieving an order by its ID
            query: (id) => ({ url: `/orders/${id}` }),

            // Extract relevant information from the response
            transformResponse: (response, meta, arg) => response.data,

            // Extracts relevant information in case of an error
            transformErrorResponse: (response, meta, arg) => response.status,

            // specify which tags we will be accessible later using the cache
            providesTags: (result, error, id) => [{ type: 'order', id }],

        }),
    }),

    // The mutation accepts an id and Deletes a post, returning a status
    deleteOrder: build.mutation({
        query: (id) => ({
            // Defines the endpoint URL for retrieving an order by its ID
            url: `/orders/${id}`,
            method: 'DELETE',
        }),
        // Extract relevant information from the response
        // even though we know the response will be just a status, it's better to beware of any mistakes
        transformResponse: (response) => response.data,

       // Extracts relevant information in case of an error
        transformErrorResponse: (response) => response.status,

       // specify which tags we will be invalidated from the cache
        invalidatesTags: ['order'],
    }),
})

export const {
    useGetOrderQuery, useDeleteOrderMutation
} = orderApi;
