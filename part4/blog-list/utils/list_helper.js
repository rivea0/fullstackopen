const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteLikes = (blogs) => {
  if (blogs.length === 1) {
    return blogs[0]
  }

  let maxLikes = 0
  let resultBlog = {}

  for (const blog of blogs) {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes
      resultBlog.title = blog.title
      resultBlog.author = blog.author
      resultBlog.likes = blog.likes
    }
  }

  return resultBlog
}

const mostBlogs = (blogs) => {
  if (blogs.length === 1) {
    return {
      author: blogs[0].author,
      blogs: 1
    }
  }

  let authorsToBlogs = new Map()

  for (const blog of blogs) {
    if (authorsToBlogs.has(blog.author)) {
      authorsToBlogs.set(blog.author, authorsToBlogs.get(blog.author) + 1)
    } else {
      authorsToBlogs.set(blog.author, 1)
    }
  }

  let maxNumBlogs = 0
  let result = {}
  for (const [author, numBlogs] of authorsToBlogs.entries()) {
    if (numBlogs > maxNumBlogs) {
      result.author = author
      result.blogs = numBlogs
    }
  }

  return result
}

const mostLikes = (blogs) => {
  if (blogs.length === 1) {
    return {
      author: blogs[0].author,
      likes: blogs[0].likes
    }
  }

  let authorsToLikes = new Map()

  for (const blog of blogs) {
    if (authorsToLikes.has(blog.author)) {
      authorsToLikes.set(blog.author, authorsToLikes.get(blog.author) + blog.likes)
    } else {
      authorsToLikes.set(blog.author, blog.likes)
    }
  }

  let maxLikes = 0
  let result = {}
  for (const [author, numLikes] of authorsToLikes.entries()) {
    if (numLikes > maxLikes) {
      maxLikes = numLikes
      result.author = author
      result.likes = numLikes
    }
  }

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteLikes,
  mostBlogs,
  mostLikes,
}
