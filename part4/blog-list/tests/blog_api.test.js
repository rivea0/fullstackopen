const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('when there are some blogs saved initially', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
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
})

describe('adding a blog', () => {
  // If running all the tests all at once (like `npm run test`),
  // changing the order of these tests will behave differently.
  // For example, if 'succeeds with valid data' test comes before,
  // the 'fails with 400 status code...' tests will fail
  // as we compare the lengths of blogsAtEnd and initialBlogs.
  // In that case, blogsAtEnd.length will be greater than initialBlogs.length.
  test('fails with 400 status code if blog is without title', async () => {
    const newBlog = {
      author: 'Donald Knuth',
      url: 'https://www-cs-faculty.stanford.edu/~knuth/lp.html',
      likes: 100
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with 400 status code if blog is without url', async () => {
    const newBlog = {
      title: 'Literate programming',
      author: 'Donald Knuth',
      likes: 100
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
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
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const foundBlog = blogsAtEnd.find(e => {
      if (e.title === newBlog.title && e.author === newBlog.author && e.url === newBlog.url) {
        return e;
      }
    })

    assert.strictEqual(foundBlog.likes, 0)
  })
})

describe('deleting a blog', () => {
  // If running all the tests all at once,
  // running this after 'adding a blog' tests will fail
  // as blogsAtEnd.length will be different than expected.
  // Run with `only` and skip the tests that modify blogs length.
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(e => e.title)
    const urls = blogsAtEnd.map(e => e.url)
    assert(!titles.includes(blogToDelete.title))
    assert(!urls.includes(blogToDelete.url))
  })
})

describe('updating blogs', () => {
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
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const resultBlog = blogsAtEnd.find(blog => blog.id === updatedBlog.id)
    assert.strictEqual(resultBlog.url, updatedBlog.url)
  })
})

describe.only('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test.only('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mlukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })

  test.only('creation fails with 400 status code and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})
after(async () => {
  await mongoose.connection.close()
})
