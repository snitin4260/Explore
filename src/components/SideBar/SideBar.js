import React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

import Invite from "../Invite/Invite"

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 6rem;
  background-color: var(--main-bg-color);
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 9rem;
  z-index: 1000;
  /* @media (max-width: 500px) {
    position: sticky;
    flex-direction: row;
    overflow: auto;
    padding-top:0;
  } */
`;


const Logo = styled.span`
  width: 24px;
  height: 24px;
  margin-bottom: 4rem;
  cursor: pointer;
`;

const Svg = styled.svg`
  color: ${props => {
    return props.group === props.selected ? "rgba(40,116,240,0.8)" : "white";
  }};
`;

class SideBar extends React.Component {
  state = {
    showInviteWindow: false,
    showMemberWindow: false
  }

  showWindow = name => {
    this.setState({
     [name]: true
    })
  }

  hideWindow = name=> {
    this.setState({
     [name]: false
    })
  }

  render() {
    const { id } = this.props.match.params;
    const {history,selected}= this.props
    return (
      <Container>
        <Logo
          onClick={() => {
            history.push(`/trip/itinerary/${id}`);
          }}
        >
          <Svg
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            group="itinerary"
            selected={selected}
          >
            <path
              fill="currentColor"
              d="M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z"
            />
          </Svg>
        </Logo>
        <Logo
          onClick={() => {
            history.push(`/trip/todo/${id}`);
          }}
        >
          <Svg
            focusable="false"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            group="todo"
            selected={selected}
          >
            <path
              fill="currentColor"
              d="M48 48a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm448 16H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"
            />
          </Svg>
        </Logo>

        <Logo
          onClick={() => {
            history.push(`/trip/chat/${id}`);
          }}
        >
          <Svg
            data-icon="comment-alt"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            group="chat"
            selected={selected}
          >
            <path
              fill="currentColor"
              d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 9.8 11.2 15.5 19.1 9.7L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64z"
            />
          </Svg>
        </Logo>
        <Logo>
          <Svg
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            group="members"
            selected={selected}
          >
            <path
              fill="currentColor"
              d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"
            ></path>
          </Svg>
        </Logo>
        {this.state.showInviteWindow && (
          <Invite tripId={id} hideInviteWindow={this.hideWindow} />
        )}
        <Logo onClick={()=>{this.showWindow("showInviteWindow")}}>
          <Svg
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            group="invite"
            selected={selected}
          >
            <path
              fill="currentColor"
              d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
            ></path>
          </Svg>
        </Logo>
      </Container>
    );
  }
}
export default withRouter(SideBar);
