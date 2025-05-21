const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

commentsRouter.get('/:id/comments', async (request, response) => {
  const comments = await Comment.find({ blog: request.params.id })
  response.json(comments)
})

commentsRouter.post('/:id/comments', async (request, response, next) => {
  const body = request.body

  if (!body.text) {
    response.status(400).json({
      error: 'comment missing',
    })
  }

  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(401).json({ error: 'invalid blog id' })
    }
    const commentObj = new Comment({
      text: body.text,
      blog: blog._id,
    })

    const comment = await commentObj.save()
    response.status(201).json(comment)
  } catch (exception) {
    next(exception)
  }
})

module.exports = commentsRouter
