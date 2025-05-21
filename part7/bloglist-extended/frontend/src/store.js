import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'
import blogReducer from './reducers/blogReducer'
import usersReducer from './reducers/usersReducer'
import commentsReducer from './reducers/commentReducer'

export const store = configureStore({
  reducer: {
    user: userReducer,
    blog: blogReducer,
    users: usersReducer,
    comments: commentsReducer,
    notification: notificationReducer,
  },
})
