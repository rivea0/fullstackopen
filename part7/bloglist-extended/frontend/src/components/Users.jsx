import { useSelector } from 'react-redux'
import { H1 } from './ui/Heading'
import StyledLink from './ui/StyledLink'

const Users = () => {
  const users = useSelector((state) => state.users.allUsers)

  return (
    <div>
      <H1>Users</H1>
      <table>
        <tbody>
          <tr>
            <td></td>
            <th>blogs created</th>
          </tr>
          {users.map(user => {
            return (
              <tr key={user.id}>
                <td><StyledLink to={`/users/${user.id}`}>{user.name}</StyledLink></td>
                <td>{user.blogs.length}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Users
