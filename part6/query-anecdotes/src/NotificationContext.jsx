import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'NEW_ANECDOTE':
      return `You added "${action.payload.anecdote}"`
    case 'VOTE_ANECDOTE':
      return `You voted for "${action.payload.anecdote}"`
    case 'ERR_NEW_ANECDOTE':
      return 'Too short anecdote, must have length 5 or more'
    case 'CLEAR':
      return ''
    default:
      return state
  }
}

const NotificationContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useNotificationMessageValue = () => {
  const messageAndDispatch = useContext(NotificationContext)
  return messageAndDispatch[0]
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNotificationMessageDispatch = () => {
  const messageAndDispatch = useContext(NotificationContext)
  return messageAndDispatch[1]
}

export const NotificationContextProvider = (props) => {
  const [notificationMessage, notificationMessageDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notificationMessage, notificationMessageDispatch]}>
      {/* eslint-disable-next-line react/prop-types */}
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext