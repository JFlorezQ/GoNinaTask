/* Please create a React Toolkit Query createApi function call
that implements the two endpoints that you find in this gist:
https://gist.github.com/FerdinandvHagen/ce5a939da313c6a8dfe2ad006fd11d9c
*/

// First, we import the functions we will need from redux toolkit

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// As for making a cleaner code we make a constant for the base url, in this case, the gist provided

const BASE_URL = 'https://gist.github.com/FerdinandvHagen/ce5a939da313c6a8dfe2ad006fd11d9c';

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ['Order'],
  endpoints: (build) => ({
    // The query accepts a number and returns a Post
    getOrder: build.query({
      // note: an optional `queryFn` may be used in place of `query`
      query: (id) => ({ url: `/orders/{id}` }),
      // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response, meta, arg) => response.data,
      // Pick out errors and prevent nested properties in a hook or selector
      transformErrorResponse: (response, meta, arg) => response.status,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
      // The 2nd parameter is the destructured `QueryLifecycleApi`
      async onQueryStarted(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          queryFulfilled,
          getCacheEntry,
          updateCachedData,
        }
      ) {},
      // The 2nd parameter is the destructured `QueryCacheLifecycleApi`
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          cacheEntryRemoved,
          cacheDataLoaded,
          getCacheEntry,
          updateCachedData,
        }
      ) {},
    }),
  }),
})
