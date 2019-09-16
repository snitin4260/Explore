import React from "react";
import styled, { css } from "styled-components";

const AlertContainer = styled.div`
  padding: 0.5rem 0.5rem;
  font-size: 1.8rem;
  font-family: "Roboto", sans-serif;
  color: black;
  background: ${props => {
    return props.group === "success"
      ? "rgb(198, 246, 213)"
      : "rgb(254, 215, 215)";
  }};
  display: ${props => {
    return props.message === "" ? "none" : "block";
  }};

  width: ${props => {
    return props.width ? `${props.width}px` : "auto";
  }};

  ${props =>
    props.dissapearingAlert &&
    css`
      position: fixed;
      z-index: 5000;
      top: 80px;
      right: 10px;
    `}
`;

const Icon = styled.svg`
  width: 2rem;
  height: 2rem;
  margin-right: 0.5rem;
`;

const SuccessIcon = styled(Icon)`
  color: green;
  margin-right: 1rem;
  display: ${props => {
    return props.group === "success" ? "inline" : "none";
  }};
`;

const CloseIcon = styled(Icon)`
  color: black;
  margin-left: 0.5rem;
  cursor: pointer;
`;

const ErrorIcon = styled(Icon)`
  color: red;
  display: ${props => {
    return props.group === "error" ? "inline" : "none";
  }};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  ${props =>
    props.dissapearingAlert &&
    css`
      justify-content: space-between;
    `}
`;

class Alert extends React.Component {
  componentDidMount() {
    const { timeout, tripId, closeAlertMessage } = this.props;
    if (timeout) {
      this.timeout = setTimeout(() => {
        closeAlertMessage(tripId);
      }, timeout);
    }
  }

  componentWillUnmount() {
    if (this.props.dissapearingAlert) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    const {
      closeAlertMessage,
      tripId,
      message,
      type,
      width,
      dissapearingAlert
    } = this.props;
    return (
      <AlertContainer
        dissapearingAlert={dissapearingAlert}
        message={message}
        group={type}
        width={width}
      >
        <Container dissapearingAlert={dissapearingAlert}>
          <ErrorIcon
            role="img"
            group={type}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192 512"
          >
            <path
              fill="currentColor"
              d="M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z"
            ></path>
          </ErrorIcon>
          <SuccessIcon
            role="img"
            group={type}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
            ></path>
          </SuccessIcon>

          <div>{message}</div>
          {dissapearingAlert && (
            <CloseIcon
              onClick={() => {
                closeAlertMessage(tripId);
              }}
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 352 512"
            >
              <path
                fill="currentColor"
                d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
              ></path>
            </CloseIcon>
          )}
        </Container>
      </AlertContainer>
    );
  }
}

export default Alert;
