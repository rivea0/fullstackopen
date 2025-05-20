import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'
import blogReducer from './reducers/blogReducer'
import usersReducer from './reducers/usersReducer'

export const store = configureStore({
  reducer: {
    user: userReducer,
    blog: blogReducer,
    users: usersReducer,
    notification: notificationReducer
  }
})
