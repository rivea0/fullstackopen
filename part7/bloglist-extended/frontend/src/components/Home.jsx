import { useDispatch, useSelector } from 'react-redux'
import AddBlogForm from './AddBlogForm'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { setNotification } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'
import { logoutUser } from '../reducers/userReducer'

const Home = ({ currentUserData }) => {
  const dispatch = useDispatch()
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const blogs = useSelector((state) => state.blog.allBlogs)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
  const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

  const handleCreateBlog = async (blogObject) => {
    try {
      dispatch(createBlog(blogObject, currentUserData.name, currentUserData.username))
      dispatch(
        setNotification(
          `a new blog ${blogObject.title} by ${blogObject.author} added`,
          'success',
          5
        )
      )
    } catch (error) {
      if (error.response.data.error === 'token expired') {
        dispatch(setNotification('user token expired', 'error', 5))
        dispatch(logoutUser())
      }
    }
  }


  return (
    <div id='all-blogs'>
      <div style={hideWhenVisible}>
        <button type="button" onClick={() => setBlogFormVisible(true)}>
          create new
        </button>
      </div>
      {blogFormVisible && (
        <>
          <h2>create new</h2>
          <AddBlogForm createBlog={handleCreateBlog} />
          <div style={showWhenVisible}>
            <button type="button" onClick={() => setBlogFormVisible(false)}>
              cancel
            </button>
          </div>
        </>
      )}

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <div style={blogStyle} key={blog.id}>
            <Link to={`/blogs/${blog.id}`} className='blog'>{blog.title}</Link>
          </div>
        ))}
    </div>
  )
}

export default Home
