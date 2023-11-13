import { configureStore } from '@reduxjs/toolkit'
import account from './account';
import global from './global';

const store =  configureStore({
  reducer: {
    account: account,
    global: global
  },
})

export default store;


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch