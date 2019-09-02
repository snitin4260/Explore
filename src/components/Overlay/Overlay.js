import React from 'react'
import styled from 'styled-components'

const OverLayContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 10;
`
class Overlay extends React.Component {
  componentDidMount () {
    document.body.style.overflow = 'hidden'
  }

  componentWillUnmount () {
    document.body.style.overflow = 'visible'
  }

  render () {
    return (
      <>
        <OverLayContainer />
      </>
    )
  }
}

export default Overlay
