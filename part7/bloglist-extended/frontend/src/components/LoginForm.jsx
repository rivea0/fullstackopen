import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/userReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useState } from 'react'
import Button from './ui/Button'
import Form from './ui/Form'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

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

  return (
    <Form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">username:</label>
        <input
          type="text"
          value={username}
          name="Username"
          id="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">password:</label>
        <input
          type="password"
          value={password}
          name="Password"
          id="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button type="submit" id="login-button">
        login
      </Button>
    </Form>
  )
}

export default LoginForm
