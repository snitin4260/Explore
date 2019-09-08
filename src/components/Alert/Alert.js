import React from "react";
import styled from "styled-components";

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
    return props.message === ""
      ? "none"
      : "block";
  }};
`;

const Icon = styled.svg`
width: 2rem;
height: 2rem;
margin-right: 0.5rem;
`

const SuccessIcon = styled(Icon)`
color: green;
margin-right: 1rem;
display: ${props => {
  return props.group ==="success"? 'inline': 'none'
}};
`

const ErrorIcon = styled(Icon)`
  color: red;
  display: ${props => {
    return props.group === "error" ? "inline" : "none";
  }};
`;

const Container = styled.div`
 display: flex;
 align-items: center;
`

function Alert(props) {
  return (
    <AlertContainer message={props.message} group={props.type}>
      <Container>
        <ErrorIcon
          role="img"
          group={props.type}
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
          group={props.type}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
          ></path>
        </SuccessIcon>

        {props.message}
      </Container>
    </AlertContainer>
  );
}

export default Alert;
