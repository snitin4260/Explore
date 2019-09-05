import React from "react";
import { Redirect } from "react-router-dom";
import {connect} from 'react-redux'
import styled from "styled-components";

import ItineraryEditItem from "./ItineraryEditItem";
import Header from '../header/Header'
import BackgroundContainer from "../BackgroundContainer/BackgroundContainer"


const mapStateToProps = state => {
  const { itinerary } = state;
  return {
    itinerary
  };
};

const Container = styled.div`
  font-family: "Roboto", sans-serif;
  font-size: 2rem;
  padding: 1.5rem;
  max-width: 96rem;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;
class ItineraryEditContainer extends React.Component {
  state = {
    redirectToTrips: false
  };

  componentDidMount() {
    const { location, itinerary } = this.props;
    if (!location.state|| (!itinerary[location.state.tripId])) {
          this.setState({
            redirectToTrips: true
          });
        }

  }

  render() {
    const {location,itinerary} = this.props
    if (this.state.redirectToTrips) {
      return <Redirect to="/trip" />;
    }
    // react router is persisting state from another page even after refreshing page
    if (!location.state|| (!itinerary[location.state.tripId])) {
      return null
    }
    const { tripId } = location.state;
    const { data } = itinerary[tripId];
    return (
      <>
        <Header />
        <BackgroundContainer>
          <Container>
            <Title>Edit Itinerary</Title>
            <>
              {data.map((data, index) => {
                return <ItineraryEditItem key={data.day} itinerary={data} />;
              })}
            </>
          </Container>
        </BackgroundContainer>
      </>
    );
  }
}

export default connect(mapStateToProps)(ItineraryEditContainer);
