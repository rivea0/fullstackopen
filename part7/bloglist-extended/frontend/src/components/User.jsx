import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const User = () => {
  const users = useSelector(state => state.users.allUsers)
  const id = useParams().id
  const foundUser = users.find((user) => user.id === String(id))

  if (!foundUser) {
    return null
  }

  return (
    <div>
      <h1>{foundUser.name}</h1>
      <h2>added blogs</h2>
      <ul>
        {foundUser.blogs.map(blog => {
          return <li key={blog.id}>{blog.title}</li>
        })}
      </ul>
    </div>
  )
}

export default User
