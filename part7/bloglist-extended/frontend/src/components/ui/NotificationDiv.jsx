import styled from 'styled-components'

const NotificationDiv = styled.div`
  padding: .75rem;
  font-size: 18px;
  margin-bottom: 10px;
  border: 1px solid black;
`

const ErrorNotification = styled(NotificationDiv)`
  background-color: #ec6f74;
  color: white;
`
const SuccessNotification = styled(NotificationDiv)`
  background-color: #6feca9;
`

export { ErrorNotification, SuccessNotification }
