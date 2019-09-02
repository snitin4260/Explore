import React from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 6rem;
  background-color: var(--main-bg-color);
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 9rem;
`

const Logo = styled.span`
  width: 24px;
  height: 24px;
  margin-bottom: 4rem;
  cursor: pointer;
`

const Svg = styled.svg`
  color: white;
`

function SideBar (props) {
  const { id } = props.match.params
  return (
    <Container>
      <Logo
        onClick={() => {
          props.history.push(`/trip/itinerary/${id}`)
        }}
      >
        <Svg
          role='img'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 576 512'
        >
          <path
            fill='currentColor'
            d='M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z'
          />
        </Svg>
      </Logo>
      <Logo
        onClick={() => {
          props.history.push(`/trip/todo/${id}`)
        }}
      >
        <Svg
          focusable='false'
          role='img'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 512 512'
        >
          <path
            fill='currentColor'
            d='M48 48a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm448 16H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z'
          />
        </Svg>
      </Logo>

      <Logo
        onClick={() => {
          props.history.push(`trip/chat/${id}`)
        }}
      >
        <Svg
          data-icon='comment-alt'
          role='img'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 512 512'
        >
          <path
            fill='currentColor'
            d='M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 9.8 11.2 15.5 19.1 9.7L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64z'
          />
        </Svg>
      </Logo>
    </Container>
  )
}

export default withRouter(SideBar)
