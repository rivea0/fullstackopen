import { useDispatch } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const filterChange = (filterText) => {
    const filterPayload = filterText ? filterText : 'ALL'
    dispatch(setFilter(filterPayload))
  }

  const handleChange = (event) => {
    filterChange(event.target.value)
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter