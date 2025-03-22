const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the first one is called React patterns', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(e => e.title)
  assert.strictEqual(titles[0], 'React patterns')
})

test('the unique identifier property of every blog is "id"', async () => {
  const response = await api.get('/api/blogs')
  const ids = response.body.map(e => e.id).filter(id => id !== undefined)

  assert.strictEqual(ids.length, response.body.length)
})

test('a valid blog can be added', async () => {
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

after(async () => {
  await mongoose.connection.close()
})
