import { useState } from 'react'
import { createComment } from '../reducers/commentReducer'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { logoutUser } from '../reducers/userReducer'
import Button from './ui/Button'
import Form from './ui/Form'
import Input from './ui/Input'
import InlineForm from './ui/InlineForm'

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
    <InlineForm onSubmit={addComment}>
      <Input
        value={commentText}
        id="new-comment"
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Enter comment"
      />
      <Button type="submit">add comment</Button>
    </InlineForm>
  )
}

export default BlogCommentForm
