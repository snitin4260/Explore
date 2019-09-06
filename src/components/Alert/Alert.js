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

function Alert(props) {
  return <AlertContainer message={props.message} group={props.type}>{props.message}</AlertContainer>;
}

export default Alert;
