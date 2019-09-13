import React from "react";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import Overlay from "../Overlay/Overlay";
import "./CreateTrip.css";
import { API_URL } from "../../api";
import { withRouter, Redirect } from "react-router-dom";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 440px;
  width: 100%;
  z-index: 100;
  background: #ffffff;
  border-radius: 4px;
  padding: 2rem;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
`;
const Label = styled.label`
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 8px;
  font-family: "R\oboto", sans-serif;
`;
const TripNameInput = styled.input`
  padding: 0.5rem;
  font-size: 1.6rem;
  font-family: "Roboto", sans-serif;
  line-height: 2.4rem;
  background-color: transparent;
  margin-bottom: 1.2rem;
`;
const InnerContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  @media (max-width: 450px) {
    & {
      flex-direction: column;
    }
  }
`;

const InputLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;
  @media (max-width: 450px) {
    & {
      margin-bottom: 1rem;
    }
  }
`;

const SubmitButton = styled.button`
  padding: 1.5rem;
  background-color: mediumseagreen;
  text-transform: uppercase;
  font-size: 1.5rem;
  border: 0.2rem;
  color: white;
  cursor: ${props => (props.isSubmitting ? "not-allowed" : "pointer")};
`;

const ErrorDiv = styled.div`
  background: red;
  color: white;
  padding: 0.6rem;
  font-size: 2rem;
  font-family: "Roboto", sans-serif;
  margin-bottom: 1rem;
  display: ${props => (props.show ? "block" : "none")};
`;

export const CloseSvg = styled.svg`
  width: 50%;
  height: 50%;
`;

export const RounDiv = styled.button`
  width: 5rem;
  height: 5rem;
  background: white;
  position: fixed;
  z-index: 500;
  border-radius: 50%;
  right: 30px;
  top: 30px;
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${props => (props.isSubmitting ? "not-allowed" : "pointer")};
`;

class CreateTrip extends React.Component {
  state = {
    error: null,
    tripName: "",
    showError: false,
    tripStartDate: new Date(),
    tripEndDate: new Date(),
    isSubmitting: false,
    redirect: false,
    closeButtonRedirect: false
  };

  changeTripName = e => {
    const text = e.target.value;
    console.log(text);
    if (text.length <= 30) {
      this.setState({
        tripName: text
      });
    }
  };

  handleStartDateChange = date => {
    if (this.state.showError) {
      this.setState({
        tripStartDate: date,
        showError: false,
        error: null
      });
    } else {
      this.setState({
        tripStartDate: date
      });
    }
  };

  handleEndDateChange = date => {
    if (this.state.showError) {
      this.setState({
        tripEndDate: date,
        showError: false,
        error: null
      });
    } else {
      this.setState({
        tripEndDate: date
      });
    }
  };

  handleCloseClick = _ => {
    this.setState({
      closeButtonRedirect: true
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { tripEndDate, tripStartDate, tripName } = this.state;

    if (tripEndDate < tripStartDate && tripName.trim() == "") {
      this.setState({
        showError: true,
        error:
          "Trip start date must be smaller than trip end date and trip name should not be empty"
      });
      return;
    }

    if (tripEndDate < tripStartDate) {
      this.setState({
        showError: true,
        error: "Trip start date must be smaller than trip end date"
      });
      return;
    }
    if (tripName.trim() === "") {
      this.setState({
        showError: true,
        error: "Trip name should not be empty"
      });
      return;
    }

    this.setState({
      isSubmitting: true
    });
    try {
      let bodyobj = {
        tripName,
        startDate: tripStartDate,
        endDate: tripEndDate
      };
      const response = await fetch(`${API_URL}/trip/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyobj)
      });
      if (response.status === 201) {
        this.setState({
          redirect: true
        });
      } else {
        const reposnseObject = await response.json();
        this.setState({
          showError: true,
          isSubmitting: false,
          error: reposnseObject.msg
        });
      }
    } catch (e) {
      this.setState({
        showError: true,
        isSubmitting: false,
        error: "Server is down. Please try again later"
      });
    }
  };

  render() {
    const {
      tripName,
      tripStartDate,
      tripEndDate,
      error,
      showError,
      isSubmitting,
      redirect,
      closeButtonRedirect
    } = this.state;
    const buttonProps = {
      disabled: isSubmitting
    };

    if (redirect) {
      return (
        <Redirect
          to={{
            pathname: "/trip/all",
            state: { message: "Trip Succesfully created" }
          }}
        />
      );
    }

    if (closeButtonRedirect) {
      return <Redirect to="/trip" />;
    }

    return (
      <>
        <RounDiv
          onClick={this.handleCloseClick}
          {...buttonProps}
          isSubmitting={isSubmitting}
        >
          <CloseSvg
            aria-hidden="true"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 352 512"
          >
            <path
              fill="currentColor"
              d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
            ></path>
          </CloseSvg>
        </RounDiv>
        <Overlay />
        <Container>
          <ErrorDiv show={showError}>{error}</ErrorDiv>
          <Form onSubmit={this.handleSubmit}>
            <Label htmlFor="tripName">Trip Name</Label>
            <TripNameInput
              id="tripName"
              value={tripName}
              onChange={this.changeTripName}
              required
            />
            <InnerContainer>
              <InputLabelContainer>
                <Label htmlFor="from-date">From</Label>

                <DatePicker
                  className="date"
                  name="tripStartDate"
                  id="from-date"
                  selected={tripStartDate}
                  dateFormat="dd/MM/yyyy"
                  locale="en-IN"
                  onChange={this.handleStartDateChange}
                />
              </InputLabelContainer>
              <InputLabelContainer>
                <Label htmlFor="to-date">To</Label>
                <DatePicker
                  name="tripEndDate"
                  className="date"
                  id="to-date"
                  dateFormat="dd/MM/yyyy"
                  selected={tripEndDate}
                  locale="en-IN"
                  onChange={this.handleEndDateChange}
                />
              </InputLabelContainer>
            </InnerContainer>
            <SubmitButton {...buttonProps} isSubmitting={isSubmitting}>
              Submit
            </SubmitButton>
          </Form>
        </Container>
      </>
    );
  }
}

export default withRouter(CreateTrip);
