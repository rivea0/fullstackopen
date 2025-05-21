import { createSlice } from '@reduxjs/toolkit'
import commentService from '../services/comments'

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    blogComments: [],
  },
  reducers: {
    setComments: (state, action) => {
      state.blogComments = action.payload
    },
    addNewComment: (state, action) => {
      state.blogComments = state.blogComments.concat(action.payload)
    },
  },
})

export const { setComments, addNewComment } = commentSlice.actions

export const getAllCommentsOfBlog = (blogId) => {
  return async (dispatch) => {
    const commentsOfBlog = await commentService.getComments(blogId)
    dispatch(setComments(commentsOfBlog))
  }
}

export const createComment = (blogId, commentObject) => {
  return async (dispatch) => {
    const response = await commentService.create(blogId, commentObject)
    dispatch(addNewComment(response.data))
  }
}

export default commentSlice.reducer
