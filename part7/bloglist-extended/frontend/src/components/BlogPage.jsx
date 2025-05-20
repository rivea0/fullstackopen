import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { setNotification } from '../reducers/notificationReducer'
import { updateBlog, removeBlog } from '../reducers/blogReducer'
import { logoutUser } from '../reducers/userReducer'

const BlogPage = ({ currentUserData }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const blogs = useSelector((state) => state.blog.allBlogs)
  const id = useParams().id
  const foundBlog = blogs.find((blog) => blog.id === String(id))

  if (!foundBlog) {
    return null
  }

  const handleRemove = async () => {
    if (
      window.confirm(`Remove blog ${foundBlog.title} by ${foundBlog.author}?`)
    ) {
      try {
        const { title: removedBlogTitle, author: removedBlogAuthor } =
          blogs.find((blog) => blog.id === foundBlog.id)
        dispatch(removeBlog(foundBlog.id))
        dispatch(
          setNotification(
            `blog ${removedBlogTitle} by ${removedBlogAuthor} deleted`,
            'success',
            5
          )
        )
        navigate('/')
      } catch (error) {
        if (error.response.data.error === 'token expired') {
          dispatch(setNotification('user token expired', 'error', 5))
          dispatch(logoutUser())
        }
      }
    } else {
      return
    }
  }

  const handleLikeUpdate = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: foundBlog.title,
      author: foundBlog.author,
      url: foundBlog.url,
      user: foundBlog.user.id,
      likes: foundBlog.likes + 1,
    }
    try {
      dispatch(updateBlog(foundBlog.id, newBlog))
      dispatch(
        setNotification(
          `blog ${newBlog.title} by ${newBlog.author} updated`,
          'success',
          5
        )
      )
    } catch (error) {
      if (error.response.data.error === 'token expired') {
        dispatch(setNotification('user token expired', 'error', 5))
        dispatch(logoutUser())
      }
    }
  }

  const addedByCurrentUser =
    currentUserData.username === foundBlog.user.username

  return (
    <div id="blogDiv">
      <h1>{foundBlog.title}</h1>
      <a href={foundBlog.url}>{foundBlog.url}</a>
      <div className="likes">
        {foundBlog.likes} {foundBlog.likes.length === 1 ? 'like' : 'likes'}
        <form onSubmit={handleLikeUpdate}>
          <button type="submit" className="likeButton">
            like
          </button>
        </form>
      </div>
      <div>Added by {foundBlog.user.name || foundBlog.user.username}</div>
      {addedByCurrentUser && (
        <div>
          <button type="button" onClick={handleRemove}>
            remove
          </button>
        </div>
      )}
    </div>
  )
}

export default BlogPage
