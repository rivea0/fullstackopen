const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
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

after(async () => {
  await mongoose.connection.close()
})
