import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { H1, H2 } from './ui/Heading'

const User = () => {
  const users = useSelector(state => state.users.allUsers)
  const id = useParams().id
  const foundUser = users.find((user) => user.id === String(id))

  if (!foundUser) {
    return null
  }

  return (
    <div>
      <H1>{foundUser.name}</H1>
      <H2>added blogs</H2>
      <ul>
        {foundUser.blogs.map(blog => {
          return <li key={blog.id}>{blog.title}</li>
        })}
      </ul>
    </div>
  )
}

export default User
