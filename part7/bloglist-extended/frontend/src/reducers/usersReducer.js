import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    allUsers: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.allUsers = action.payload
    },
  },
})

export const { setUsers } = usersSlice.actions

export const getAllUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch(setUsers(users))
  }
}

export default usersSlice.reducer
