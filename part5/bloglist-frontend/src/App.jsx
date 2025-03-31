import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import AddBlogForm from './components/AddBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationMessageType, setNotificationMessageType] = useState(null);
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const createBlog = async (blogObject) => {
    try {
      const response = await blogService.create(blogObject)

      const updatedBlogs = blogs.concat({ ...blogObject, id: response.data.id })

      setBlogs(updatedBlogs)
      setNotificationMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setNotificationMessageType('success')

      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationMessageType(null)
      }, 5000)

      setBlogFormVisible(false)
    } catch (error) {
      if (error.response.data.error === 'token expired') {
        setNotificationMessage('user token expired')
        setNotificationMessageType('error')
        handleLogout()
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationMessageType(null)
        }, 5000)
      }
    }
  }

  const updateBlog = async (blogId, updatedBlogObject) => {
    try {
      await blogService.update(blogId, updatedBlogObject)
      const blogToUpdate = blogs.find(blog => blog.id === blogId)
      const updatedBlogs = blogs.map(blog => {
        if (blog.id === blogId) {
          return { ...updatedBlogObject, user: blogToUpdate.user, id: blogId }
        } else {
          return blog
        }
      })
      setBlogs(updatedBlogs)
      setNotificationMessage(`blog ${updatedBlogObject.title} by ${updatedBlogObject.author} updated`)
      setNotificationMessageType('success')

      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationMessageType(null)
      }, 5000)
    } catch (error) {
      if (error.response.data.error === 'token expired') {
        setNotificationMessage('user token expired')
        setNotificationMessageType('error')
        handleLogout()
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationMessageType(null)
        }, 5000)
      }
    }
  }

  const removeBlog = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId)
      setBlogs(blogs.filter(blog => blog.id !== blogId))

      const {
        title: removedBlogTitle,
        author: removedBlogAuthor
      } = blogs.find(blog => blog.id === blogId)
      setNotificationMessage(`blog ${removedBlogTitle} by ${removedBlogAuthor} deleted`)
      setNotificationMessageType('success')

      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationMessageType(null)
      }, 5000)
    } catch (error) {
      if (error.response.data.error === 'token expired') {
        setNotificationMessage('user token expired')
        setNotificationMessageType('error')
        handleLogout()
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationMessageType(null)
        }, 5000)
      }
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage('wrong username or password')
      setNotificationMessageType('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationMessageType(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
  const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

  return (
    <div>
      <Notification
        message={notificationMessage}
        messageType={notificationMessageType}
      />
      {user === null ?
        <div>
          <h2>log in to application</h2>
          {loginForm()}
        </div> :
        <div>
          <h2>blogs</h2>
          <div>{user.name} logged in
            <button type="button" onClick={handleLogout}>logout</button>
          </div>
          <div style={hideWhenVisible}>
            <button type="button" onClick={() => setBlogFormVisible(true)}>create new blog</button>
          </div>
          { blogFormVisible && (
            <>
              <h2>create new</h2>
              <AddBlogForm createBlog={createBlog} />
              <div style={showWhenVisible}>
                <button type="button" onClick={() => setBlogFormVisible(false)}>cancel</button>
              </div>
            </>
          )}
          {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              // `user` object only has `token`, `username`, `name` fields.
              // user's `id` can be added to response data in the login route in the backend (which is against part4 exercise requirements)
              // and checked for equality with the blog's user `ids`.
              // `username` field is used in this case, as it's also unique in schema.
              addedByUser={user.username === blog.user.username}
              removeBlog={removeBlog}
            />
          )}
        </div>
      }
    </div>
  )
}

export default App
