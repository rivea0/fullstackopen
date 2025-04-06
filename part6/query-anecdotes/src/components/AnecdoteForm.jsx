import { useQueryClient, useMutation } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationMessageDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const notificationMessageDispatch = useNotificationMessageDispatch()

  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
    onError: () => {
      notificationMessageDispatch({
        type: 'ERR_NEW_ANECDOTE'
      })
      setTimeout(() => {
        notificationMessageDispatch({ type: 'CLEAR' })
      }, 5000)
    }
  })

  const getId = () => (100000 * Math.random()).toFixed(0)

  const asObject = (anecdote) => {
    return {
      content: anecdote,
      id: getId(),
      votes: 0
    }
  }

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate(asObject(content))
    notificationMessageDispatch({
      type: 'NEW_ANECDOTE',
      payload: {
        anecdote: content
      }
    })
    setTimeout(() => {
      notificationMessageDispatch({ type: 'CLEAR' })
    }, 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
