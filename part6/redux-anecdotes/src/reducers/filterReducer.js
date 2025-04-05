const reducer = (state = 'ALL', action) => {
  switch(action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}

export const filterAnecdote = (filterText) => {
  return {
    type: 'SET_FILTER',
    payload: filterText
  }
}

export default reducer
