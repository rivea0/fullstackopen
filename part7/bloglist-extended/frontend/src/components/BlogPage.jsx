import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { setNotification } from '../reducers/notificationReducer'
import { updateBlog, removeBlog } from '../reducers/blogReducer'
import { logoutUser } from '../reducers/userReducer'
import { getAllCommentsOfBlog } from '../reducers/commentReducer'
import { useEffect } from 'react'
import BlogCommentForm from './BlogCommentForm'
import Button from './ui/Button'
import RedButton from './ui/RedButton'
import { H1, H2 } from './ui/Heading'
import StyledLink from './ui/StyledLink'

const BlogPage = ({ currentUserData }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const blogs = useSelector((state) => state.blog.allBlogs)
  const id = useParams().id
  const foundBlog = blogs.find((blog) => blog.id === String(id))

  useEffect(() => {
    if (foundBlog) {
      dispatch(getAllCommentsOfBlog(id))
    }
  }, [dispatch, foundBlog, id])

  const commentsOfBlog = useSelector((state) => state.comments.blogComments)

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
      <H1>{foundBlog.title}</H1>
      <StyledLink href={foundBlog.url}>{foundBlog.url}</StyledLink>
      <div className="likes">
        {foundBlog.likes} {foundBlog.likes.length === 1 ? 'like' : 'likes'}
        <form onSubmit={handleLikeUpdate}>
          <Button type="submit" className="likeButton">like</Button>
        </form>
      </div>
      <div>Added by {foundBlog.user.name || foundBlog.user.username}</div>
      {addedByCurrentUser && (
        <div>
          <RedButton type="button" onClick={handleRemove}>remove</RedButton>
        </div>
      )}
      <div>
        <H2>comments</H2>
        <BlogCommentForm blogId={foundBlog.id} />
        {commentsOfBlog && (
          <ul>
            {[...commentsOfBlog].map((comment) => (
              <li key={comment.id}>{comment.text}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default BlogPage
