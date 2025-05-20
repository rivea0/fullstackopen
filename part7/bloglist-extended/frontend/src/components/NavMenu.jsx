import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { logoutUser } from '../reducers/userReducer'

const NavMenu = ({ currentUserName }) => {
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logoutUser())
  }
  const navHeaderStyle = {
    backgroundColor: 'silver',
    padding: '4px'
  }

  return (
    <div style={navHeaderStyle}>
      <Link style={{ padding: '4px' }} to="/">
        blogs
      </Link>
      <Link style={{ padding: '4px' }} to="/users">
        users
      </Link>
      <span style={{ paddingLeft: '8px' }}>
        {currentUserName} logged in
        <button type="button" onClick={handleLogout}>
          logout
        </button>
      </span>
    </div>
  )
}

export default NavMenu
