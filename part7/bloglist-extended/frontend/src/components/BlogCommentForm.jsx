import { useState } from 'react'
import { createComment } from '../reducers/commentReducer'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { logoutUser } from '../reducers/userReducer'

const BlogCommentForm = ({ blogId }) => {
  const [commentText, setCommentText] = useState('')
  const dispatch = useDispatch()

  const addComment = async (event) => {
    event.preventDefault()

    const newComment = {
      text: commentText,
    }

    try {
      dispatch(createComment(blogId, newComment))
      dispatch(setNotification('Comment added!', 'success', 5))
      setCommentText('')
    } catch (error) {
      if (error.response.data.error === 'token expired') {
        dispatch(setNotification('user token expired', 'error', 5))
        dispatch(logoutUser())
      }
    }
  }

  return (
    <form onSubmit={addComment}>
      <input
        value={commentText}
        id="new-comment"
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Enter comment"
      />
      <button type="submit">add comment</button>
    </form>
  )
}

export default BlogCommentForm
