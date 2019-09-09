import React from 'react';
import styled from 'styled-components'

import UserDashboard from "../UserdashBoard/UserDashBoard"


class Chat extends React.Component {
    render() {
        return (
            <UserDashboard selected="chat">
                Hi
            </UserDashboard>
        )
    }
}

export default Chat