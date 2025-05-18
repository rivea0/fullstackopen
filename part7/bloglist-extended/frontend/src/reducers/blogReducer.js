import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    allBlogs: [],
  },
  reducers: {
    setBlogs: (state, action) => {
      state.allBlogs = action.payload
    },
    addNewBlog: (state, action) => {
      state.allBlogs = state.allBlogs.concat(action.payload)
    },
    removeExistingBlog: (state, action) => {
      state.allBlogs = state.allBlogs.filter((blog) => blog.id !== action.payload)
    },
  },
})

export const { setBlogs, addNewBlog, removeExistingBlog } = blogSlice.actions

export const getAllBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blogObject, userDataName, userDataUsername) => {
  return async (dispatch) => {
    const response = await blogService.create(blogObject)
    dispatch(
      addNewBlog({
        ...blogObject,
        id: response.data.id,
        user: {
          id: response.data.user,
          name: userDataName,
          username: userDataUsername,
        },
        likes: blogObject.likes || 0,
      })
    )
  }
}

export const updateBlog = (blogId, updatedBlogObject) => {
  return async (dispatch) => {
    await blogService.update(blogId, updatedBlogObject)
    const blogs = await blogService.getAll()
    const blogToUpdate = blogs.find(blog => blog.id === blogId)
    const updatedBlogs = blogs.map(blog => {
      if (blog.id === blogId) {
        return { ...updatedBlogObject, user: blogToUpdate.user, id: blogId }
      } else {
        return blog
      }
    })
    dispatch(setBlogs(updatedBlogs))
  }
}

export const removeBlog = (blogId) => {
  return async (dispatch) => {
    await blogService.deleteBlog(blogId)
    dispatch(removeExistingBlog(blogId))
  }
}

export default blogSlice.reducer
