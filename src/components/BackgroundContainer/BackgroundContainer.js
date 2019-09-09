import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  min-height: ${props =>{
    if(!props.subHeight)
    return 'calc(100vh - 60px)'
    return `calc(100vh - ${props.subHeight}px)`
  }};
  padding: 2rem;
  background: ${props => {
     return props.bg?  props.bg: 'rgba(103,146,103,0.2)'
  }};
`

function BackgroundContainer (props) {
  return <Container  subHeight={props.subHeight} bg={props.bg}>{props.children}</Container>
}

export default BackgroundContainer
