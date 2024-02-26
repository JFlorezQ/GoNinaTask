// We have prepared a small code snippet for RTK Query (“custom base query”) 
//in order to intercept calls and automatically perform a token exchange if the old token has expired.

//The question is now – is the code correct – or did we do any mistakes?
// Let us know if the snippet is correct. 
//Should you find any errors, let us know what they are and why you believe they are an error.

//https://gist.github.com/FerdinandvHagen/88800c25a34c279e6214fbb736cd8c82

// The code is not correct, there are errors in lines 23-24, 32-35 & 41-43. In This lines I described the error.

import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { tokenReceived, loggedOut } from './authSlice'
import { Mutex } from 'async-mutex'



// Here I consider the base URL must be more specific to correctly access information
const baseQuery = fetchBaseQuery({ baseUrl: '/' })

// Might be baseQueryWithReauth so the purpose of the function is more clear
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
// Here is one mistake, mutex creation mut be the first thing to do after import, and must not be inside any function.
// Because it can affect the properties and the accessibility of the function
//create a new mutex
  const mutex = new Mutex()
    
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock()
    
  let result = await baseQuery(args, api, extraOptions)
 // We must specify that we recieve an error an it's error 401 (failed http petition)
 // Because there could be other errors happening and we wouldn't notice
  if (result.error // && result.error.status === 401
  ) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
    
      try {
        const refreshResult = await baseQuery(
          '/refreshToken',
          api,
          extraOptions
        )
    
        if (refreshResult.data) {
          api.dispatch(tokenReceived(refreshResult.data))
          // retry the initial query
          result = await baseQuery(args, api, extraOptions)
        } else {
          api.dispatch(loggedOut())
        }
    
      } finally {
        // release must be called once the mutex should be released again.
        release()
      }
    
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }
    
  return result
}