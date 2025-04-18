import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const response = await axios.post(baseUrl, asObject(content))

  return response.data
}

const updateAnecdote = async (id, updatedObj) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedObj)
  return response.data
}

export default { getAll, createNew, updateAnecdote }
