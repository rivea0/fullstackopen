import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    message: '',
    messageType: ''
  },
  reducers: {
    addNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return { message: '', messageType: '' }
    }
  }
})

export const { addNotification, clearNotification } = notificationSlice.actions

export const setNotification = (message, messageType, seconds) => {
  return async (dispatch) => {
    dispatch(addNotification({ message, messageType }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
