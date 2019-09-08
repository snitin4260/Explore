import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

import ItineraryEditItem from "./ItineraryEditItem";
import Header from "../header/Header";
import BackgroundContainer from "../BackgroundContainer/BackgroundContainer";
import { changeItinerary } from "../../actions/setItineraryObject";
import { SaveButton } from "./ItineraryEditItem";
import setTripObject from "../../actions/setTripObject";
import setItineraryObject from "../../actions/setItineraryObject";
import getItineraryData from "../../actions/getItineraryData";

const mapStateToProps = state => {
  const { itinerary } = state;
  return {
    itinerary
  };
};

const mapDispatchToProps = dispatch => ({
  changeItinerary: ({ tripId, _id, activity }) => {
    dispatch(changeItinerary({ tripId, _id, activity }));
  },
  setTripObject: tripId => {
    dispatch(setTripObject(tripId));
  },
  setItineraryObject: tripId => {
    dispatch(setItineraryObject(tripId));
  },

  getItineraryData: tripId => {
    dispatch(getItineraryData(tripId));
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
    const { id } = this.props.match.params;
    const { itinerary, changeItinerary } = this.props;
    const tripItinerary = itinerary[id];
    if (!tripItinerary) return null;
    if (this.state.redirectToDashBoard) {
      return <Redirect to={`/trip/itinerary/${id}`} />;
    }
    const { data } = itinerary[id];
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
                    tripId={id}
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
