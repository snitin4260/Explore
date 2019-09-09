import React from "react";
import styled from "styled-components";
import uuid from "uuid";


import { API_URL } from "../../api";
import Alert from "../Alert/Alert";
import { Loader } from "../Todo/Modal";

export const ItineraryLoader = styled(Loader)`
  position: absolute;
  top: 0;
  left: 210px;
  display: ${props => {
    return props.isSendingData ? "block" : "none";
  }};
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 0.2rem solid black;
  border-top-left-radius: 0.4rem;
  border-top-right-radius: 0.4rem;
  color: black;
  font-family: "Roboto", sans-serif;
  padding: 1.5rem 1.714rem;
  cursor: pointer;
  margin-bottom: ${props => {
    return props.isExpand ? "0" : "1rem";
  }};
`;

const Line = styled.span`
  width: 1.6rem;
  height: 0.2rem;
  display: block;
  background: black;
`;

const ExpandSvg = styled.svg`
  width: 1.8rem;
  height: 1.8rem;
`;

const Title = styled.h4`
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 200;
`;

const AccordionContentContainer = styled.div`
  display: ${props => {
    return props.isExpand ? "block" : "none";
  }};
  border: 0.2rem solid black;
  border-top: 0;
  border-bottom-left-radius: 0.4rem;
  border-bottom-right-radius: 0.4rem;
  padding: 1.714rem;
  font-family: "Roboto", sans-serif;
  margin-bottom: 1rem;
`;

const LocationContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CommonText = styled.h4`
  font-weight: 100;
`;

const LocationLabelText = styled(CommonText)`
  flex: 0 1 auto;
`;

const ActivityLabelText = styled(CommonText)`
  margin-bottom: 1rem;
`;

const LocationInputContainer = styled.div`
  flex: 1 1 30rem;
  margin-left: 3rem;
  @media (max-width: 500px) {
    flex: 0 0 auto;
    width: 100%;
    margin: 1rem 0;
  }
`;

export const LocationInput = styled.input`
  display: block;
  width: 100%;
  max-width: 40rem;
  font-size: 1.6rem;
  font-family: "Roboto", sans-serif;
  border: 2px solid rgb(220, 220, 220);
  border-radius: 6px;
  height: 40px;
  padding: 0.6rem 1.4rem;
  &:focus {
    outline: 0;
    border-color: #f4bb00;
  }
`;

const ActivityInputItemContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const ActivityInputItem = styled(LocationInput)`
  margin-right: 1rem;
  display: inline-block;
  flex-grow: 1;
  max-width: 60rem;
`;

export const DeleteSvg = styled.svg`
  width: 2rem;
  height: 2rem;
  color: rgba(240, 52, 52, 0.9);
  margin-top: 1.2rem;
  cursor: pointer;
`;

const AccordionActivityContainer = styled.div``;

const AccordionActivityInnerContainer = styled.div``;

const SaveButtonContainer = styled.div`
  margin-top: 2rem;
  position: relative;
`;

export const SaveButton = styled.button`
  background: #00ad9f;
  border: 0;
  display: inline-block;
  border-radius: 4px;
  max-width: 20rem;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1),
    0 2px 4px 0 rgba(14, 30, 37, 0.12);
  padding: 0.7rem 1.4rem;
  display: inline-block;
  cursor: ${props => {
    console.log(props)
    return props.isSendingData ? "not-allowed" : "pointer";
  }};
  font-size: 1.6rem;
  color: white;
`;

export const AddSvgContainer = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: var(--main-bg-color);
  width: 3rem;
  height: 3rem;
  cursor: pointer;
`;

export const AddSvg = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  color: white;
`;

const AddActivityText = styled.span`
  color: black;
  margin-left: 1rem;
`;

const AddActivityContainer = styled.div`
  margin-bottom: 1rem;
`;

class ItineraryEdititem extends React.Component {
  
  state = {
    isExpand: false,
    location: this.props.itinerary.location,
    activity: this.props.itinerary.activity,
    createActivityError: null,
    validationError: "",
    serverError: "",
    successMessage: "",
    isSendingData: false
  };

  handleLocationchange = e => {
    const { value } = e.target;
    this.removeErrorMessage();
    this.setState({
      location: value
    });
  };

  checkAllInputsAreValid() {
    const { activity } = this.state;
    let emptyInputArray = [];
    if (this.state.location.trim() === "") emptyInputArray.push("Location");
    for (let i = 0; i < activity.length; i++) {
      let activityObj = activity[i];
      if (activityObj.task.trim() === "") {
        emptyInputArray.push("Activity");
        break;
      }
    }
    if (emptyInputArray.length === 0) {
      return {
        state: true
      };
    }
    return {
      state: false,
      message: `${emptyInputArray.join(",")} should not be empty`
    };
  }

  removeErrorMessage() {
    
    if (this.state.validationError) {
      this.setState({
        validationError: ""
      });
      return;
    }
    if (this.state.serverError) {
      this.setState({
        serverError: ""
      });
    }

    if (this.state.successMessage) {
      this.setState({
        successMessage: ""
      });
    }
  }

  saveChanges = async _ => {
    this.removeErrorMessage();
    const response = this.checkAllInputsAreValid();
    if (!response.state) {
      this.setState({
        validationError: response.message
      });
      return;
    }

    const { tripId } = this.props;
    try {
      // have to add userId and text in body
      this.setState({
        isSendingData: true
      });
      const itineraryObj = {
        _id: this.props.itinerary._id,
        activity: this.state.activity,
        tripId
      };
      const response = await fetch(`${API_URL}/itinerary/edit/${tripId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(itineraryObj)
      });
      const activityObj = await response.json();
      this.setState({
        isSendingData: false
      });
      if (response.status === 200) {
        this.setState({
          successMessage: "Changes saved"
        });
        this.props.changeItinerary({
          tripId,
          _id: this.props.itinerary._id,
          activity: this.state.activity
        });
      } else {
        this.setState({
          serverError: activityObj.msg
        });
      }
    } catch (e) {
      this.setState({
        serverError: "Server is down. Please try after some time",
        isSendingData: false
      });
    }
  };

  insertNewTask = _ => {
    const newId = uuid.v4();
    const newActivity = Array.from(this.state.activity);
    newActivity.push({
      _id: newId,
      task: ""
    });
    this.setState({
      activity: newActivity
    });
  };

  handleTaskInputChange = (e, id) => {
    // check any validations errors are there
    this.removeErrorMessage();
    const { value } = e.target;
    const newActivity = this.state.activity.map(activityObj => {
      if (activityObj._id === id) {
        return {
          ...activityObj,
          task: value
        };
      }
      return activityObj;
    });

    this.setState({
      activity: newActivity
    });
  };

  deleteItem = id => {
    this.removeErrorMessage();
    const newActivity = this.state.activity.filter(activityObj => {
      if (activityObj._id !== id) {
        return true;
      }

      return false;
    });

    this.setState({
      activity: newActivity
    });
  };

  toggleClick = () => {
    this.setState(prevState => ({
      isExpand: !prevState.isExpand
    }));
  };

  render() {
    const { day, date } = this.props.itinerary;
    const {
      isExpand,
      location,
      activity,
      isSendingData,
      validationError,
      serverError,
      successMessage
    } = this.state;

    const buttonProps = {
      disabled: isSendingData
    };

    return (
      <>
        <TitleContainer onClick={this.toggleClick} id={day} isExpand={isExpand}>
          <Title>
            DAY {day}| {date} {location}
          </Title>
          <div>
            {isExpand ? (
              <Line />
            ) : (
              <ExpandSvg>
                <path d="M14 1.002a1 1 0 0 0-1.546-.836L6.97 3.742 1.55.167a1 1 0 0 0-1.1 1.67l5.967 3.936a1 1 0 0 0 1.097.002l6.032-3.935A.998.998 0 0 0 14 1.002z" />
              </ExpandSvg>
            )}
          </div>
        </TitleContainer>
        <AccordionContentContainer isExpand={isExpand}>
          <LocationContainer>
            <LocationLabelText>Location:</LocationLabelText>
            <LocationInputContainer>
              <LocationInput
                value={location}
                onChange={this.handleLocationchange}
                type="text"
              />
            </LocationInputContainer>
          </LocationContainer>
          <AccordionActivityContainer>
            <ActivityLabelText>Activity</ActivityLabelText>
            <AccordionActivityInnerContainer>
              {activity.map(activityObj => {
                return (
                  <ActivityInputItemContainer key={activityObj._id}>
                    <ActivityInputItem
                      value={activityObj.task}
                      onChange={e => {
                        this.handleTaskInputChange(e, activityObj._id);
                      }}
                    />
                    <DeleteSvg
                      onClick={() => this.deleteItem(activityObj._id)}
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path
                        fill="currentColor"
                        d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"
                      />
                    </DeleteSvg>
                  </ActivityInputItemContainer>
                );
              })}
            </AccordionActivityInnerContainer>
          </AccordionActivityContainer>
          <AddActivityContainer>
            <AddSvgContainer onClick={this.insertNewTask}>
              <AddSvg
                aria-hidden="true"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
                ></path>
              </AddSvg>
            </AddSvgContainer>
            <AddActivityText>Add Activity</AddActivityText>
          </AddActivityContainer>
          <Alert type="error" message={validationError} />
          <Alert type="error" message={serverError} />
          <Alert type="success" message={successMessage} />
          <SaveButtonContainer>
            <SaveButton
              onClick={this.saveChanges}
              isSendingData={isSendingData}
              {...buttonProps}
            >
              Save Changes
            </SaveButton>
            <ItineraryLoader isSendingData={isSendingData} />
          </SaveButtonContainer>
        </AccordionContentContainer>
      </>
    );
  }
}

export default ItineraryEdititem;
