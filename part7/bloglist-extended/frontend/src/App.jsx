import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import Notification from './components/Notification'
import AddBlogForm from './components/AddBlogForm'
import { setNotification } from './reducers/notificationReducer'
import { authUser, loginUser, logoutUser } from './reducers/userReducer'
import { createBlog, getAllBlogs, updateBlog, removeBlog } from './reducers/blogReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.user.signedInUser)
  const blogs = useSelector((state) => state.blog.allBlogs)

  useEffect(() => {
    dispatch(getAllBlogs())
    dispatch(authUser())
  }, [dispatch])


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          id="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          id="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id="login-button">login</button>
    </form>
  )

  const handleCreateBlog = async (blogObject) => {
    try {
      dispatch(createBlog(blogObject, currentUser.name, currentUser.username))
      dispatch(setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`, 'success', 5))
      setBlogFormVisible(false)
    } catch (error) {
      if (error.response.data.error === 'token expired') {
        dispatch(setNotification('user token expired', 'error', 5))
        handleLogout()
      }
    }
  }

  const handleUpdateBlog = async (blogId, updatedBlogObject) => {
    try {
      dispatch(updateBlog(blogId, updatedBlogObject))
      dispatch(setNotification(`blog ${updatedBlogObject.title} by ${updatedBlogObject.author} updated`, 'success', 5))
    } catch (error) {
      if (error.response.data.error === 'token expired') {
        dispatch(setNotification('user token expired', 'error', 5))
        handleLogout()
      }
    }
  }

  const handleRemoveBlog = async (blogId) => {
    try {
      const {
        title: removedBlogTitle,
        author: removedBlogAuthor
      } = blogs.find(blog => blog.id === blogId)
      dispatch(removeBlog(blogId))
      dispatch(setNotification(`blog ${removedBlogTitle} by ${removedBlogAuthor} deleted`, 'success', 5))
    } catch (error) {
      if (error.response.data.error === 'token expired') {
        dispatch(setNotification('user token expired', 'error', 5))
        handleLogout()
      }
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(loginUser(username, password))
      .then(() => {
        setUsername('')
        setPassword('')
      })
      .catch(() => {
        dispatch(setNotification('wrong username or password', 'error', 5))
      })
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
  const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

  return (
    <div>
      <Notification />
      {currentUser === null ?
        <div>
          <h2>log in to application</h2>
          {loginForm()}
        </div> :
        <div id="all-blogs">
          <h2>blogs</h2>
          <div>{currentUser.name} logged in
            <button type="button" onClick={handleLogout}>logout</button>
          </div>
          <div style={hideWhenVisible}>
            <button type="button" onClick={() => setBlogFormVisible(true)}>create new blog</button>
          </div>
          { blogFormVisible && (
            <>
              <h2>create new</h2>
              <AddBlogForm createBlog={handleCreateBlog} />
              <div style={showWhenVisible}>
                <button type="button" onClick={() => setBlogFormVisible(false)}>cancel</button>
              </div>
            </>
          )}
          {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={handleUpdateBlog}
              // `user` object only has `token`, `username`, `name` fields.
              // user's `id` can be added to response data in the login route in the backend (which is against part4 exercise requirements)
              // and checked for equality with the blog's user `ids`.
              // `username` field is used in this case, as it's also unique in schema.
              // addedByUser={user.username === blog.user.username}
              addedByUser={currentUser.username === blog.user.username}
              removeBlog={handleRemoveBlog}
            />
          )}
        </div>
      }
    </div>
  )
}

export default App
