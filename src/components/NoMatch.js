import React from 'react'
import styled from 'styled-components'
import {Redirect} from 'react-router-dom'

import LogoHeader from './logoHeader/LogoHeader'
import BackgroundContainer from './BackgroundContainer/BackgroundContainer'
import { SaveButton } from "./Itinerary/ItineraryEditItem";

const ErrorMessage = styled.div`
margin-top: 11rem;
text-align: center;
font-size: 2rem;
color: black;
margin-bottom: 2rem;
font-family: 'Roboto', sans-serif;
`

const ButtonContainer = styled.div`
display: flex;
justify-content: center;
`

const Button = styled(SaveButton)`
text-transform: uppercase;
`

class NoMatch extends React.Component { 
    state={
        redirectToHomepage: false
    }

    redirect=()=> {
        this.setState({
            redirectToHomepage: true
        })
    }
    render() {
    if(this.state.redirectToHomepage) {
        return <Redirect to="/"/>
    }
    return (
      <>
        <LogoHeader />
        <BackgroundContainer subHeight="40">
          <ErrorMessage>
            Unfortunately the page you are looking for has been moved or deleted
          </ErrorMessage>
          <ButtonContainer>
              <Button onClick={this.redirect}>Go to Homepage</Button>
          </ButtonContainer>
        </BackgroundContainer>
      </>
    );
    }

}

export default NoMatch