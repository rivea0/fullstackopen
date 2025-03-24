const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const User = require('../models/user')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('when there are some blogs saved initially', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    // Create new user
    const newUser = { username: 'root', password: 'secret' }
    const responseUser = await api
      .post('/api/users')
      .send(newUser)

    // Login new user
    await api
      .post('/api/login')
      .send(newUser)

    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs.map(blog => ({ ...blog, user: responseUser.body.id })))
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(e => e.title)
    const authors = response.body.map(e => e.author)
    const urls = response.body.map(e => e.url)

    assert(titles.includes('React patterns'))
    assert(authors.includes('Michael Chan'))
    assert(urls.includes('https://reactpatterns.com/'))
  })

  test('the unique identifier property of every blog is "id"', async () => {
    const response = await api.get('/api/blogs')
    const ids = response.body.map(e => e.id).filter(id => id !== undefined)

    assert.strictEqual(ids.length, response.body.length)
  })

  test('user field is included within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const users = response.body.map(e => e.user)

    assert.strictEqual(users.length, response.body.length)
  })

  test('the returned blogs have correct user fields', async () => {
    const response = await api.get('/api/blogs')

    const usersOfBlogsInDb = await Promise.all(response.body.map(async (blog) => {
      const blogInDb = await Blog.findById(blog.id)
      return blogInDb.user.toString()
    }))

    const returnedUsers = response.body.map(blog => blog.user.id)

    assert.deepStrictEqual(usersOfBlogsInDb, returnedUsers)
  })
})

describe('adding a blog', () => {
  let headers = null

  beforeEach(async () => {
    await User.deleteMany({})

    // Create new user
    const newUser = { username: 'root', password: 'secret' }
    const responseUser = await api
      .post('/api/users')
      .send(newUser)

    // Login new user
    const responseLogin = await api
      .post('/api/login')
      .send(newUser)

    headers = { 'Authorization': `Bearer ${responseLogin.body.token}` }

    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs.map(blog => ({ ...blog, user: responseUser.body.id })))
  })

  test('fails with 400 status code if blog is without title', async () => {
    const newBlog = {
      author: 'Donald Knuth',
      url: 'https://www-cs-faculty.stanford.edu/~knuth/lp.html',
      likes: 100
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    assert(response.body.error.includes('title missing'))
  })

  test('fails with 400 status code if blog is without url', async () => {
    const newBlog = {
      title: 'Literate programming',
      author: 'Donald Knuth',
      likes: 100
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    assert(response.body.error.includes('url missing'))
  })

  test('fails with 401 status code when token is invalid', async () => {
    const newBlog = {
      title: 'I am a poem I am not software',
      author: 'Robin Rendle',
      url: 'https://robinrendle.com/notes/i-am-a-poem-i-am-not-software/',
      likes: 50
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('token invalid'))
  })

  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'I am a poem I am not software',
      author: 'Robin Rendle',
      url: 'https://robinrendle.com/notes/i-am-a-poem-i-am-not-software/',
      likes: 50
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(e => e.title)
    const authors = blogsAtEnd.map(e => e.author)
    const urls = blogsAtEnd.map(e => e.url)

    assert(titles.includes('I am a poem I am not software'))
    assert(authors.includes('Robin Rendle'))
    assert(urls.includes('https://robinrendle.com/notes/i-am-a-poem-i-am-not-software/'))
  })

  test('if the likes property is missing, it will default to 0', async () => {
    const newBlog = {
      title: 'Plain text journaling',
      author: 'Herman Martinus',
      url: 'https://herman.bearblog.dev/plain-text-journaling/',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const foundBlog = blogsAtEnd.find(e => {
      if (e.title === newBlog.title && e.author === newBlog.author && e.url === newBlog.url) {
        return e
      }
    })

    assert.strictEqual(foundBlog.likes, 0)
  })
})

describe('deleting a blog', () => {
  let headers = null

  beforeEach(async () => {
    await User.deleteMany({})

    // Create new user
    const newUser = { username: 'root', password: 'secret' }
    const responseUser = await api
      .post('/api/users')
      .send(newUser)

    // Login new user
    const responseLogin = await api
      .post('/api/login')
      .send(newUser)

    headers = { 'Authorization': `Bearer ${responseLogin.body.token}` }

    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs.map(blog => ({ ...blog, user: responseUser.body.id })))
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set(headers)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(e => e.title)
    const urls = blogsAtEnd.map(e => e.url)

    assert(!titles.includes(blogToDelete.title))
    assert(!urls.includes(blogToDelete.url))
  })

  test('fails with 401 status code if token is invalid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('token invalid'))
  })

  test('fails with 401 status code if user is invalid', async () => {
    // Create another user
    const newUser2 = { username: 'root2', password: 'secret2' }
    await api
      .post('/api/users')
      .send(newUser2)

    // Login the newly created user
    const loginResponse = await api
      .post('/api/login')
      .send(newUser2)

    const blogsAtStart = await helper.blogsInDb()

    // Belongs to the first user created inside beforeEach
    const blogToDelete = blogsAtStart[0]

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ 'Authorization': `Bearer ${loginResponse.body.token}` })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('invalid user'))
  })
})

describe('updating blogs', () => {
  let headers = null

  beforeEach(async () => {
    await User.deleteMany({})

    // Create new user
    const newUser = { username: 'root', password: 'secret' }
    const responseUser = await api
      .post('/api/users')
      .send(newUser)

    // Login new user
    const responseLogin = await api
      .post('/api/login')
      .send(newUser)

    headers = { 'Authorization': `Bearer ${responseLogin.body.token}` }

    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs.map(blog => ({ ...blog, user: responseUser.body.id })))
  })

  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      title: 'JavaScript patterns',
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const resultBlog = blogsAtEnd.find(blog => blog.id === updatedBlog.id)
    assert.strictEqual(resultBlog.title, updatedBlog.title)
  })

  test('updates likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const resultBlog = blogsAtEnd.find(blog => blog.id === updatedBlog.id)
    assert.strictEqual(resultBlog.likes, blogToUpdate.likes + 1)
  })

  test('updates author', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      author: 'Lee Rob',
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const resultBlog = blogsAtEnd.find(blog => blog.id === updatedBlog.id)
    assert.strictEqual(resultBlog.author, updatedBlog.author)
  })

  test('updates url', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      url: 'https://patterns.dev',
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const resultBlog = blogsAtEnd.find(blog => blog.id === updatedBlog.id)
    assert.strictEqual(resultBlog.url, updatedBlog.url)
  })

  test('fails with 401 status code when token is invalid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      url: 'https://patterns.dev',
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('token invalid'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
