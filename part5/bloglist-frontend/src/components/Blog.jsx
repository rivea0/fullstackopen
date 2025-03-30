import { useState } from 'react'

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
      <div>
        {blog.title} {blog.author}
        <button type="button" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
        {showDetails &&
          <>
            <div>{blog.url}</div>
            <div>likes {blog.likes}
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

export default Blog