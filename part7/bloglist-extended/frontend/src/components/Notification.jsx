import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { ErrorNotification, SuccessNotification } from './ui/NotificationDiv'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  if (notification.message === '') {
    return null
  }
  return notification.messageType === 'error' ? (
    <ErrorNotification>{notification.message}</ErrorNotification>
  ) : (
    <SuccessNotification>{notification.message}</SuccessNotification>
  )
}

Notification.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  messageType: PropTypes.string,
}

export default Notification
