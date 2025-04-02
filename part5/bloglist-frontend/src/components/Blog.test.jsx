import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const mockUpdateBlog = vi.fn()
const mockRemoveBlog = vi.fn()

const blog = {
  title: 'React patterns',
  author: 'Dan Abramov',
  url: 'https://overreacted.io',
  likes: 132,
  user: {
    id: 'testId',
    username: 'rivea0',
    name: 'Eda'
  },
  id: 'testBlogId'
}

describe('<Blog />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        addedByUser
        removeBlog={mockRemoveBlog}
      />
    ).container
  })

  test('displays title and author, not url and likes by default', () => {
    const titleAndAuthorDiv = container.querySelector('.blogTitleAndAuthorInfo')
    expect(titleAndAuthorDiv).toHaveTextContent('React patterns - Dan Abramov')

    const urlDiv = screen.queryByText('https://overreacted.io')
    const likesDiv = screen.queryByText('likes: 132')
    expect(urlDiv).toBeNull()
    expect(likesDiv).toBeNull()
  })

  test('url and the number of likes can be displayed by clicking the view button', async () => {
    const urlDiv = screen.queryByText('https://overreacted.io')
    const likesDiv = screen.queryByText('likes: 132')
    expect(urlDiv).toBeNull()
    expect(likesDiv).toBeNull()

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(urlDiv).toBeDefined()
    expect(likesDiv).toBeDefined()
  })


  test('updateBlog is called twice when the like button is clicked twice', async () => {
    const user = userEvent.setup()

    // First expand the view
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })
})
