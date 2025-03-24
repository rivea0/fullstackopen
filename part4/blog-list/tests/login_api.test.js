const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('login', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('existing user can be successfully logged in', async () => {
    await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'secret'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('fails with 401 status code if password is incorrect', async () => {
    const result = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'doesNotExist'
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('invalid username or password'))
  })

  test('fails with 401 status code if username is incorrect', async () => {
    const result = await api
      .post('/api/login')
      .send({
        username: 'doesNotExist',
        password: 'secret',
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('invalid username or password'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
