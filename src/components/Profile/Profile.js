import React from "react"
import styled from "styled-components"

import Header from "../header/Header"
import BackgroundContainer from "../BackgroundContainer/BackgroundContainer"

class Profile extends React.Component {
    componentDidMount() {

    }
    render() {
        return (
            <>
            <Header />
            <BackgroundContainer>
                <div>hello</div>

            </BackgroundContainer>
            </>
        )
    }
}

export default Profile