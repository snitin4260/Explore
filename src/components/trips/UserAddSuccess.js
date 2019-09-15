import React, {useState} from "react"
import {Link} from "react-router-dom"
import styled from "styled-components"

const SuccessContainer = styled.div`
margin-top: 10rem;
text-align: center;
font-size: 2rem;
font-family: 'Roboto', sans-serif;
line-height: 1.6rem;
`
const IconContainer = styled.div`
display: flex;
justify-content: center;
align-items: center;
margin-bottom: 1rem;
`

const Icon = styled.svg`
 width: 30px;
 height: 30px;
 color: green;
`

function UserAddSuccess(props) {
  const {adminName} = props
    const [redirect,toggleRedirect] = useState(false)
    return (
      <SuccessContainer>
        <IconContainer>
          <Icon
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
            ></path>
          </Icon>
        </IconContainer>
        You have been added to {adminName}'s group
        <br />
        <Link style={{
          textDecoration: 'none',
          display: 'block',
          marginTop: '1rem'
        }} to="/login"> Click here to Login</Link>
      </SuccessContainer>
    );

}

export default UserAddSuccess