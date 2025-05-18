import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  if (notification.message === '') {
    return null
  }
  return (
    <div className={notification.messageType}>
      {notification.message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  messageType: PropTypes.string
}

export default Notification
