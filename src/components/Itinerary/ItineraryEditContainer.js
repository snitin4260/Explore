import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

import ItineraryEditItem from "./ItineraryEditItem";
import Header from "../header/Header";
import BackgroundContainer from "../BackgroundContainer/BackgroundContainer";
import { changeItinerary } from "../../actions/setItineraryObject";
import { SaveButton } from "./ItineraryEditItem";

const mapStateToProps = state => {
  const { itinerary } = state;
  return {
    itinerary
  };
};

const mapDispatchToProps = dispatch => ({
  changeItinerary: ({ tripId, _id, activity }) => {
    dispatch(changeItinerary({ tripId, _id, activity }));
  }
});

const DashBoardButton = styled(SaveButton)``;

const DashBoardButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
`;
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
    redirectToTrips: false,
    redirectToDashBoard: false
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    if (!this.props.itinerary[id]) {
      this.props.setTripObject(id);
      this.props.setItineraryObject(id);
      const { getItineraryData } = this.props;
      getItineraryData(id);
    }
  }

  redirectToDashBoard = _ => {
    this.setState({
      redirectToDashBoard: true
    });
  };

  render() {
    const { location, itinerary, changeItinerary } = this.props;
    if (this.state.redirectToTrips) {
      return <Redirect to="/trip" />;
    }

    if (this.state.redirectToDashBoard) {
      return <Redirect to={`/trip/itinerary/${location.state.tripId}`} />;
    }

    // react router is persisting state from another page even after refreshing page
    if (!location.state || !itinerary[location.state.tripId]) {
      return null;
    }
    const { tripId } = location.state;
    const { data } = itinerary[tripId];
    return (
      <>
        <Header />
        <BackgroundContainer>
          <Container>
            <Title>Edit Itinerary</Title>
            <DashBoardButtonContainer>
              <DashBoardButton onClick={this.redirectToDashBoard}>
                Go back to dashboard
              </DashBoardButton>
            </DashBoardButtonContainer>

            <>
              {data.map((data, index) => {
                return (
                  <ItineraryEditItem
                    changeItinerary={changeItinerary}
                    tripId={tripId}
                    key={data.day}
                    itinerary={data}
                  />
                );
              })}
            </>
          </Container>
        </BackgroundContainer>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItineraryEditContainer);
