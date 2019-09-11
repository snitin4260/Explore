import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import io from "socket.io-client";

import UserDashboard from "../UserdashBoard/UserDashBoard";
import {
  setChatObject,
  getChatMessages,
  addChatMessage
} from "../../actions/chatActions";
import setTripObject from "../../actions/setTripObject";

const SocketUrl = "http://127.0.0.1:3002";

const mapStateToProps = state => ({
  chat: state.chat,
  tripData: state.tripData
});

const mapDispatchToProps = dispatch => ({
  setChatObject: tripId => {
    dispatch(setChatObject(tripId));
  },
  setTripObject: tripId => {
    dispatch(setTripObject(tripId));
  },
  getChatMessages: tripId => {
    dispatch(getChatMessages(tripId));
  },
  addChatMessage: ({ tripId, message }) => {
    dispatch(addChatMessage({ tripId, message }));
  }
});



class Chat extends React.Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    const { tripData, chat, setTripObject, setChatObject } = this.props;
    if (!tripData[id]) {
      setTripObject(id);
    }
    if (!chat[id]) {
      setChatObject(id);
      // fetch early messages here
    }
    this.initSocket();
  }

  initSocket = () => {
    // this.socket = io(SocketUrl);
    // this.socket.emit("join");
  };

  componentWillUnmount() {
    this.socket.emit("disconnected");
    // add remove event listeners for socket here
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props.match.params;
    const { addChatMessage } = this.props;
    const prevChat = prevProps.chat[id];
    const currentChat = this.props.chat[id];
    if (!prevChat || !currentChat) return;
    const currentError = currentChat.error;
    // make connection after old data has been shown
    console.log(prevChat);
    console.log(currentChat);
    if (prevChat.isLoading !== currentChat.isLoading && !currentError) {
      this.socket.on("message-received", message => {
        addChatMessage({
          tripId: id,
          message
        });
      });
    }
  }

  render() {
    const { id } = this.props.match.params;
    const { chat } = this.props;
    const tripChat = chat[id];
    if (!tripChat) return null;
    return (
      <UserDashboard selected="chat">
        <div>Loading</div>
      </UserDashboard>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
