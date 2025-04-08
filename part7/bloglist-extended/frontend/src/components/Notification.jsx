import PropTypes from 'prop-types'

const Notification = ({ message, messageType }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={messageType}>
      {message}
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
