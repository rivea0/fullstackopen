import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, addedByUser, removeBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLikeUpdate = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user.id,
      likes: blog.likes + 1,
    }
    await updateBlog(blog.id, newBlog)
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await removeBlog(blog.id)
    } else {
      return
    }
  }
  return (
    <div style={blogStyle}>
      <div className='blogTitleAndAuthorInfo'>
        {blog.title} - {blog.author}
        <button type="button" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
        {showDetails &&
          <>
            <div className='url'>{blog.url}</div>
            <div className='likes'>likes: {blog.likes}
              <form onSubmit={handleLikeUpdate}>
                <button type="submit">like</button>
              </form>
            </div>
            <div>{blog.user.name || blog.user.username}</div>
            {addedByUser &&
            <div>
              <button type="button" onClick={handleRemove}>remove</button>
            </div>}
          </>
        }
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.exact({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateBlog: PropTypes.func.isRequired,
  addedByUser: PropTypes.bool.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog