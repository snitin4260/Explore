import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 400px;
  width: 300px;
  height: calc(100vh - 62px);
  background: #fafafa;
  position: fixed;
  top: 62px;
  right: 0;
  z-index: 100;
  transition: transform 0.4s ease-out;
  transform: translateX(${props => props.show ? '0' : '100%'});
  font-size: 2rem;
`

function SlidingNote ({ show }) {
  return (
    <Container show={show}>
      <p>Hellooowsdsdmnbsamnasdsw</p>
    </Container>
  )
}

export default SlidingNote
