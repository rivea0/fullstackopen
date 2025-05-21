import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { logoutUser } from '../reducers/userReducer'
import Button from './ui/Button'
import NavHeader from './ui/NavHeader'

const NavMenu = ({ currentUserName }) => {
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <NavHeader>
      <Link to="/">
        blogs
      </Link>
      <Link to="/users">
        users
      </Link>
      <span>
        {currentUserName} logged in
        <Button type="button" onClick={handleLogout}>
          Logout
        </Button>
      </span>
    </NavHeader>
  )
}

export default NavMenu
