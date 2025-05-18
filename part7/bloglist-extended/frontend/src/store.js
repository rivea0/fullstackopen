import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'
import blogReducer from './reducers/blogReducer'

export const store = configureStore({
  reducer: {
    user: userReducer,
    blog: blogReducer,
    notification: notificationReducer
  }
})
