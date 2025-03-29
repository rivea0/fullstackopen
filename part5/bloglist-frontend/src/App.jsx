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
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </div>
  )
}

export default App
