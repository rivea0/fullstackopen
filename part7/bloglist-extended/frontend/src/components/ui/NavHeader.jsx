import styled from 'styled-components'

const NavHeader = styled.div`
  display: flex;
  font-weight: bold;
  border: 2px solid #4CA0E8;
  border-radius: .25rem;
  background-color: #E7F9F6;
  a {
    border: 1px solid #BEC6EF;
    &:hover {
      border: 1px solid #4CA0E8;
      background-color: #BEC6EF;
      color: black;
    }
    padding: .25rem 1rem;
  }
  span {
    margin-left: auto;
    padding: .25rem .5rem;
    border: 1px solid transparent;
    button {
      margin-left: 8px;
    }
  }
`

export default NavHeader
