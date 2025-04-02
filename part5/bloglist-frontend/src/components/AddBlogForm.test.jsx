import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddBlogForm from './AddBlogForm'

test('the event handler is called with right details when a new blog is added', async () => {
  const mockCreateBlog = vi.fn()
  const user = userEvent.setup()

  render(<AddBlogForm createBlog={mockCreateBlog} />)

  const titleInput = screen.getByPlaceholderText('Enter title')
  const authorInput = screen.getByPlaceholderText('Enter author')
  const urlInput = screen.getByPlaceholderText('Enter url')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'React Tech Stack')
  await user.type(authorInput, 'Robin Wieruch')
  await user.type(urlInput, 'https://www.robinwieruch.de/react-tech-stack/')
  await user.click(createButton)

  expect(mockCreateBlog.mock.calls).toHaveLength(1)
  expect(mockCreateBlog.mock.calls[0][0].title).toBe('React Tech Stack')
  expect(mockCreateBlog.mock.calls[0][0].author).toBe('Robin Wieruch')
  expect(mockCreateBlog.mock.calls[0][0].url).toBe('https://www.robinwieruch.de/react-tech-stack/')
})
