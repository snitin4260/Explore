import React from 'react'
import SideBar from '../SideBar/SideBar'
import BackgroundContainer from '../BackgroundContainer/BackgroundContainer'
import Header from '../header/Header'
import styled from 'styled-components'

const Container = styled.div`
  min-height: 100%;
`
const InnerContainer = styled.div`
  min-height: 100%;
  padding-left: 6rem;
`

class UserDashBoard extends React.Component {
  render () {
    const { bg,selected, bgPad } = this.props
    return (
      <Container>
        <InnerContainer>
          <Header />
          <SideBar selected={selected}/>
          <BackgroundContainer bgPad={bgPad} bg={bg}>
            {this.props.children}
          </BackgroundContainer>
        </InnerContainer>
      </Container>
    );
  }
}

export default UserDashBoard
