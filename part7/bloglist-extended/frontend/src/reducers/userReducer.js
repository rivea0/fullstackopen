import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    signedInUser: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.signedInUser = action.payload
    },
    clearUser: (state) => {
      state.signedInUser = null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export const authUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }
}

export const loginUser = (username, password) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      loginService.login({
        username, password
      }).then(user => {
        window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
        blogService.setToken(user.token)
        dispatch(setUser(user))
        resolve(user)
      }).catch((exception) => {
        reject(exception)
      })
    })
  }
  // return async (dispatch) => {
  //   // eslint-disable-next-line no-useless-catch
  //   try {
  //     const user = await loginService.login({
  //       username,
  //       password,
  //     })
  //     window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
  //     blogService.setToken(user.token)
  //     dispatch(setUser(user))
  //   } catch (exception) {
  //     throw exception
  //   }
  // }

  // try {
  //   const user = await loginService.login({
  //     username,
  //     password,
  //   })
  //   window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
  //   blogService.setToken(user.token)
  //   dispatch(setUser(user))
  // } catch (exception) {
  //   console.log('--- here', exception)
  //   throw exception
  // }
}

export const logoutUser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(clearUser())
  }
}

export default userSlice.reducer
