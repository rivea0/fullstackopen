import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getComments = (blogId) => {
  const request = axios.get(`${baseUrl}/${blogId}/comments`)
  return request.then((response) => response.data)
}

const create = async (blogId, newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(
    `${baseUrl}/${blogId}/comments`,
    newObject,
    config
  )
  return response
}

export default { getComments, setToken, create }
