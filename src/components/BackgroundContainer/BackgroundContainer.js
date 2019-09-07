import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  min-height: calc(100vh - 50px);
  padding: 2rem;
  position: relative;
  background: ${props => {
     return props.bg?  props.bg: 'rgba(103,146,103,0.2)'
  }};
`

function BackgroundContainer (props) {
  return <Container bg={props.bg}>{props.children}</Container>
}

export default BackgroundContainer
