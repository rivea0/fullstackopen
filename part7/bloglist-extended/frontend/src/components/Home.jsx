import { useDispatch, useSelector } from 'react-redux'
import AddBlogForm from './AddBlogForm'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { setNotification } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'
import { logoutUser } from '../reducers/userReducer'
import Button from './ui/Button'
import RedButton from './ui/RedButton'
import { H2 } from './ui/Heading'
import BlogTitleDiv from './ui/BlogTitleDiv'
import StyledLink from './ui/StyledLink'

const Home = ({ currentUserData }) => {
  const dispatch = useDispatch()
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const blogs = useSelector((state) => state.blog.allBlogs)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
  const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

  const handleCreateBlog = async (blogObject) => {
    try {
      dispatch(createBlog(blogObject, currentUserData.name, currentUserData.username))
      dispatch(
        setNotification(
          `a new blog ${blogObject.title} by ${blogObject.author} added`,
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

  return (
    <div id='all-blogs'>
      <div style={hideWhenVisible}>
        <Button type="button" onClick={() => setBlogFormVisible(true)}>create new</Button>
      </div>
      {blogFormVisible && (
        <>
          <H2>create new</H2>
          <AddBlogForm createBlog={handleCreateBlog} />
          <div style={showWhenVisible}>
            <RedButton type="button" onClick={() => setBlogFormVisible(false)}>cancel</RedButton>
          </div>
        </>
      )}

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <BlogTitleDiv key={blog.id}>
            <StyledLink to={`/blogs/${blog.id}`} className='blog'>{blog.title}</StyledLink>
          </BlogTitleDiv>
        ))}
    </div>
  )
}

export default Home
