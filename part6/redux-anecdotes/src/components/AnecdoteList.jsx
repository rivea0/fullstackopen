import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import Filter from './Filter'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    if (state.filter === 'ALL') {
      return state.anecdotes
    }
    return state.anecdotes.filter(anecdote => {
      return anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
    })
  })

  const dispatch = useDispatch()

  const vote = async (id, content) => {
    dispatch(voteAnecdote(id))
    dispatch(setNotification(`you voted for "${content}"`, 5))
  }

  return (
    <div>
      <Filter />
      {[...anecdotes].sort((a, b) => b.votes - a.votes).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
