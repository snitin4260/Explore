import React from 'react'
import styled from 'styled-components'

const ErrorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 8px;
  color: white;
  background: red;
  text-align: center;
  display: flex;
  z-index: 200;
  justify-content: space-between;
`

const CloseIcon = styled.span`
  color: white;
  font-size: 1rem;
  cursor: pointer;
`

function ErrorDisplay (props) {
  return (
    <ErrorContainer>
      <div>{props.text}</div>
      <CloseIcon>
        <svg
          style={{
            width: '20px',
            height: '20px',
            color: 'white'
          }}
          role='img'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 352 512'
        >
          <path
            fill='currentColor'
            d='M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z'
          />
        </svg>
      </CloseIcon>
    </ErrorContainer>
  )
}

export default ErrorDisplay
