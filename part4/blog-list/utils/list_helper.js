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

module.exports = {
  dummy,
  totalLikes,
  favoriteLikes
}
