import { useState } from 'react'
import PropTypes from 'prop-types'

const AddBlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    }

    await createBlog(newBlog)

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }


  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          value={newBlogTitle}
          onChange={(e) => setNewBlogTitle(e.target.value)}
          placeholder="Enter title"
        />
      </div>
      <div>
        author:
        <input
          value={newBlogAuthor}
          onChange={(e) => setNewBlogAuthor(e.target.value)}
          placeholder="Enter author"
        />
      </div>
      <div>
        url:
        <input
          value={newBlogUrl}
          onChange={(e) => setNewBlogUrl(e.target.value)}
          placeholder="Enter url"
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

AddBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default AddBlogForm
