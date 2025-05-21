import { useState } from 'react'
import PropTypes from 'prop-types'
import Button from './ui/Button'
import Input from './ui/Input'
import Form from './ui/Form'

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
    <Form onSubmit={addBlog}>
      <div>
        <label htmlFor="new-blog-title">title:</label>
        <Input
          value={newBlogTitle}
          id="new-blog-title"
          onChange={(e) => setNewBlogTitle(e.target.value)}
          placeholder="Enter title"
        />
      </div>
      <div>
        <label htmlFor="new-blog-author">author:</label>
        <Input
          value={newBlogAuthor}
          id="new-blog-author"
          onChange={(e) => setNewBlogAuthor(e.target.value)}
          placeholder="Enter author"
        />
      </div>
      <div>
        <label htmlFor="new-blog-url">url:</label>
        <Input
          value={newBlogUrl}
          id="new-blog-url"
          onChange={(e) => setNewBlogUrl(e.target.value)}
          placeholder="Enter url"
        />
      </div>
      <Button type="submit" id="create-blog-button">
        create
      </Button>
    </Form>
  )
}

AddBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default AddBlogForm
