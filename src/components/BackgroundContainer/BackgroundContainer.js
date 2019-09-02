import React from 'react'
import styled, { css } from 'styled-components'

const Container = styled.div`
  min-height: calc(100vh - 62px);
  padding: 2rem;
  position: relative;
  background: ${props => {
    return props.bg
  }};
`

function BackgroundContainer (props) {
  return <Container bg={props.bg}>{props.children}</Container>
}

export default BackgroundContainer
