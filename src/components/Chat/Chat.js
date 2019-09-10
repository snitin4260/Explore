import React from "react";
import styled from "styled-components";
import {connect} from 'react-redux'

import UserDashboard from "../UserdashBoard/UserDashBoard";
import socketIOClient from "socket.io-client";

class Chat extends React.Component {
  componentDidMount() {
    // const { id } = this.props.match.params;
    // if (!this.props.itinerary[id]) {
    //   this.props.setTripObject(id);
    //   this.props.setItineraryObject(id);
    //   const { getItineraryData } = this.props;
    //   getItineraryData(id);
    // }
  }
  render() {
    return <UserDashboard selected="chat"></UserDashboard>;
  }
}

export default connect()(Chat);
