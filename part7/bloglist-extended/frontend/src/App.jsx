import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogPage from './components/BlogPage'
import Notification from './components/Notification'
import { authUser } from './reducers/userReducer'
import { getAllBlogs } from './reducers/blogReducer'
import { getAllUsers } from './reducers/usersReducer'
import Home from './components/Home'
import Users from './components/Users'
import User from './components/User'
import LoginForm from './components/LoginForm'
import NavMenu from './components/NavMenu'

const App = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.user.signedInUser)

  useEffect(() => {
    dispatch(authUser())
    dispatch(getAllBlogs())
    dispatch(getAllUsers())
  }, [dispatch])

  return (
    <Router>
      <div>
        <Notification />
        {currentUser === null ? (
          <div>
            <h2>log in to application</h2>
            <LoginForm />
          </div>
        ) : (
          <div>
            <NavMenu currentUserName={currentUser.name} />
            <h2>blog app</h2>
            <Routes>
              <Route
                path="/"
                element={<Home currentUserData={currentUser} />}
              />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<User />} />
              <Route
                path="/blogs/:id"
                element={<BlogPage currentUserData={currentUser} />}
              />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
