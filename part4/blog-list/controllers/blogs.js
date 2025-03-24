const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const body = request.body
  let userId = null

  try {
    userId = request.user
    if (!userId) {
      return response.status(401).json({ error: 'token invalid' })
    }
  } catch(exception) {
    next(exception)
  }

  if (!body.title) {
    return response.status(400).json({
      error: 'title missing'
    })
  }

  if (!body.url) {
    return response.status(400).json({
      error: 'url missing'
    })
  }

  try {
    const user = await User.findById(userId)
    if (!user) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id
    })

    const result = await blog.save()

    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result)
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  let userId = null

  try {
    userId = request.user
    if (!userId) {
      return response.status(401).json({ error: 'token invalid' })
    }
  } catch(exception) {
    next(exception)
  }

  try {
    const blogToDelete = await Blog.findById(request.params.id)

    if (blogToDelete) {
      if (userId.toString() === blogToDelete.user.toString()) {
        await blogToDelete.deleteOne()
        response.status(204).end()
      } else {
        response.status(401).json({ error: 'invalid user' })
      }
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response, next) => {
  const body = request.body

  let userId = null

  try {
    userId = request.user
    if (!userId) {
      return response.status(401).json({ error: 'token invalid' })
    }
  } catch(exception) {
    next(exception)
  }

  if (!body.title) {
    return response.status(400).json({
      error: 'title missing'
    })
  }

  if (!body.url) {
    return response.status(400).json({
      error: 'url missing'
    })
  }

  let blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: (!body.likes) ? 0 : body.likes
  }

  try {
    const user = await User.findById(userId)
    if (!user) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(400).end()
    }
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter
