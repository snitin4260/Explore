import React from "react";
import Select from "react-select";
import getItineraryData from "../../actions/getItineraryData";
import UserDashBoard from "../UserdashBoard/UserDashBoard";
import setTripObject from "../../actions/setTripObject";
import setItineraryObject from "../../actions/setItineraryObject";
import { CHANGE_ITINERARY_SELECT_OPTION } from "../../actions/actionConstants";
import styles from "./ItineraryDisplay.module.css";
import styled from "styled-components";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const mapStateToProps = state => {
  return {
    itinerary: state.itinerary
  };
};

const mapDispatchToProps = dispatch => ({
  setTripObject: tripId => {
    dispatch(setTripObject(tripId));
  },
  setItineraryObject: tripId => {
    dispatch(setItineraryObject(tripId));
  },

  getItineraryData: tripId => {
    dispatch(getItineraryData(tripId));
  },
  changeItinerarySelectOption: ({ selectedOption, tripId }) => {
    dispatch({
      type: CHANGE_ITINERARY_SELECT_OPTION,
      payload: {
        selectedOption,
        tripId
      }
    });
  }
});

const customSelectStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px solid #222",
    color: state.isSelected ? "black" : "#222",
    padding: 10,
    fontSize: "2rem",
    fontFamily: "'Roboto', sans-serif"
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";
    const fontSize = "2rem";
    const fontFamily = "'Roboto', sans-serif";
    return { ...provided, opacity, transition, fontSize, fontFamily };
  }
};

const Main = styled.main`
  max-width: 960px;
  margin: 0 auto;
`;

const SelectContainer = styled.div`
  max-width: 50rem;
  margin: 0 auto;
`;

const DatePlaceContainer = styled.div`
  text-align: center;
  font-size: 1.6rem;
  font-family: "Roboto", sans-serif;
  background: rgba(40, 116, 240, 0.8);
  margin-top: 3rem;
  padding: 1rem;
  display: inline-block;
  color: white;
`;

const DateSpan = styled.span`
  margin-right: 0.2rem;
`;
const PlaceSpan = styled.span`
  margin-left: 0.2rem;
`;

const ActivityContainerUl = styled.ul`
  list-style: none;
`;

const ActivityItemLi = styled.li`
  border: 2px solid black;
  padding: 1rem;
  font-size: 2rem;
  background: white;
  margin-bottom: 2rem;
  border-radius: 3px;
  font-family: "Roboto", sans-serif;
  color: white;
  background: var(--main-bg-color);
`;

const ItineraryHeader = styled.h1`
  font-family: "Ubuntu", sans-serif;
  font-size: 5rem;
  text-align: center;
  color: #222;
  margin-bottom: 1.4rem;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
  @media (max-width: 600px) {
    & {
      margin-bottom: 2rem;
    }
  }
`;
const ItineraryButton = styled.button`
  padding: 1rem;
  text-transform: uppercase;
  background: #276ef1;
  font-size: 1.8rem;
  color: white;
  border: none;
  cursor: pointer;
  font-family: "Roboto", sans-serif;
`;

class ItineraryDisplay extends React.Component {
  state = {
    redirectToEditItinerary: false
  };
  componentDidMount() {
    const { id } = this.props.match.params;
    console.log(id);
    this.props.setTripObject(id);
    this.props.setItineraryObject(id);
    const { getItineraryData } = this.props;
    getItineraryData(id);
  }

  getSelectOptions() {
    const { id } = this.props.match.params;
    const { itinerary } = this.props;
    const tripItinerary = itinerary[id];
    const { data } = tripItinerary;
    const itineraryDays = data.map(dayObj => {
      const dayData = `Day ${dayObj.day}| ${dayObj.date} ${dayObj.location}`;
      return {
        value: dayObj.day,
        label: dayData
      };
    });
    return itineraryDays;
  }

  renderSelectedDayDetails() {
    const { id } = this.props.match.params;
    const { itinerary } = this.props;
    const tripItinerary = itinerary[id];
    const { data, selectedOption } = tripItinerary;
    const tripObj = data.filter(ItineraryDayData => {
      if (ItineraryDayData.day === selectedOption.value) {
        return true;
      }
      return false;
    });
    const { location, activity, date } = tripObj[0];
    return (
      <>
        <DatePlaceContainer>
          <DateSpan>{date}</DateSpan>
          &#183;
          <PlaceSpan>{location}</PlaceSpan>
        </DatePlaceContainer>
        <ActivityContainerUl>
          {activity.map(activityObj => {
            return (
              <ActivityItemLi key={activityObj._id}>
                {activityObj.task}
              </ActivityItemLi>
            );
          })}
        </ActivityContainerUl>
      </>
    );
  }

  render() {
    if (this.state.redirectToEditItinerary) {
      return <Redirect to={{ pathname: "/trip/itinerary/edit" , state: {
        tripId: this.props.match.params.id
      } }} />;
    }
    const { id } = this.props.match.params;
    const { itinerary, changeItinerarySelectOption } = this.props;
    const tripItinerary = itinerary[id];
    console.log(tripItinerary);
    if (!tripItinerary) return null;
    const { isLoading, error, selectedOption } = tripItinerary;
    return (
      <>
        <UserDashBoard bg="rgba(103, 146, 103, 0.2)">
          <Main>
            {error ? (
              <div>Failed loading page </div>
            ) : (
              <div>
                {isLoading ? (
                  <>
                    <div className={`loadingDiv ${styles.select_loader}`} />
                    <div className={`loadingDiv ${styles.block}`} />
                    <div className={`loadingDiv ${styles.block}`} />
                    <div className={`loadingDiv ${styles.block}`} />
                  </>
                ) : (
                  <>
                    <ItineraryHeader>Itinerary</ItineraryHeader>
                    <ButtonContainer>
                      <ItineraryButton onClick={() => {
                        this.setState({
                          redirectToEditItinerary: true
                        })
                      }}>Edit</ItineraryButton>
                    </ButtonContainer>
                    <SelectContainer>
                      <Select
                        styles={customSelectStyles}
                        options={this.getSelectOptions()}
                        value={selectedOption}
                        onChange={selectedOption => {
                          console.log(selectedOption);
                          changeItinerarySelectOption({
                            selectedOption,
                            tripId: id
                          });
                        }}
                      />
                    </SelectContainer>
                    {this.renderSelectedDayDetails()}
                  </>
                )}
              </div>
            )}
          </Main>
        </UserDashBoard>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItineraryDisplay);
