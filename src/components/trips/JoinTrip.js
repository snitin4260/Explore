import React from "react";
import { Redirect } from "react-router-dom";
import queryString from "query-string";
import styled from "styled-components";

import LogoHeader from "../logoHeader/LogoHeader";
import { API_URL } from "../../api";
import BackgroundContainer from "../BackgroundContainer/BackgroundContainer";
import Alert from "../Alert/Alert";
import { rotate } from "../Todo/Modal";
import NoAccountJoinTrip from "./NoAccountJoinTrip";
import UserAddSuccess from "./UserAddSuccess";

export const Spinner = styled.div`
  height: 20px;
  width: 20px;
  animation: ${rotate} 0.8s infinite linear;
  border: 2px solid white;
  border-right-color: transparent;
  border-radius: 50%;
`;

const LoadingDiv = styled.div`
  height: 40px;
  margin-bottom: 2rem;
`;

const LoaderContainer = styled.div`
  max-width: 600px;
  margin: 8rem auto;
`;

const AlertContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  margin-top: ${props => `${props.mt}rem`};
`;

const Container = styled.div`
  max-width: 40rem;
  margin: 0 auto;
`;
const ButtonContainer = styled.div`
  margin-top: 10rem;
`;

export const JoinButton = styled.button`
  text-transform: uppercase;
  color: white;
  background-color: var(--main-bg-color);
  border: 0;
  width: 100%;
  font-weight: 600;
  padding: 1.2rem 1rem;
  cursor: ${props => {
    return props.isSubmitting ? "not-allowed" : "pointer";
  }};
  font-size: 1.5rem;
  font-family: "Roboto", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class JoinTrip extends React.Component {
  state = {
    showSuccessPage: false,
    isFetching: true,
    hasAccount: false,
    isSubmitting: false,
    adminName: null,
    serverFetchingError: {
      status: false,
      message: ""
    },
    serverSendingError: {
      status: false,
      message: ""
    }
  };

  submitData = async _ => {
    const { id } = this.props.match.params;
    this.setState({
      isSubmitting: true
    });
    try {
      const emailObj = {
        type: "direct",
        email: this.email,
        key: this.key
      };
      const response = await fetch(`${API_URL}/trip/user/add/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(emailObj)
      });
      const responseData = await response.json();
      if (response.status === 200) {
        this.setState({
          showSuccessPage: true,
          isSubmitting: false
        });
      } else {
        this.setState({
          serverSendingError: {
            status: true,
            message: responseData.msg
          },
          isSubmitting: false
        });
      }
    } catch (e) {
      this.setState({
        serverSendingError: {
          status: true,
          message: "Server is down. Please try again later"
        },
        isSubmitting: false
      });
    }
  };

  async componentDidMount() {
    this.setState({
      isFetching: true
    });
    const { id } = this.props.match.params;
    const { search } = this.props.location;
    const { email, key } = queryString.parse(search);
    // store result for later use
    this.key = key;
    this.email = email;
    try {
      const emailObj = {
        email,
        key
      };
      const response = await fetch(`${API_URL}/join/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(emailObj)
      });
      const responseData = await response.json();
      if (response.status === 200) {
        this.setState({
          hasAccount: responseData.hasAccount,
          adminName: responseData.userName,
          isFetching: false
        });
      } else {
        this.setState({
          serverFetchingError: {
            status: true,
            message: responseData.msg
          },
          isFetching: false
        });
      }
    } catch (e) {
      this.setState({
        serverFetchingError: {
          status: true,
          message: "Server is down. Please try again later"
        },
        isFetching: false
      });
    }
  }

  onRequestSuccess = () => {
    this.setState({
      showSuccessPage: true
    });
  };

  render() {
    const {
      isFetching,
      hasAccount,
      serverFetchingError,
      serverSendingError,
      adminName,
      isSubmitting,
      showSuccessPage
    } = this.state;
    const directJoinButtonProps = {
      disabled: isSubmitting
    };
    const { id } = this.props.match.params;
    if (this.state.redirect) {
      const msg = hasAccount
        ? `You have been added to ${adminName}'s group. Please login`
        : `Account created. You have been added ${adminName}'s group `;
      return (
        <Redirect
          to={{
            pathname: "/login"
          }}
        />
      );
    }

    return (
      <>
        <LogoHeader />

        {isFetching ? (
          <BackgroundContainer subHeight="40">
            <LoaderContainer>
              <LoadingDiv className="loadingDiv"></LoadingDiv>
              <LoadingDiv className="loadingDiv"></LoadingDiv>
              <LoadingDiv className="loadingDiv"></LoadingDiv>
            </LoaderContainer>
          </BackgroundContainer>
        ) : (
          <BackgroundContainer subHeight="40">
            {!serverFetchingError.status ? (
              <>
                {showSuccessPage ? (
                  <Container>
                    <UserAddSuccess adminName={adminName} />
                  </Container>
                ) : (
                  <>
                    {hasAccount ? (
                      <Container>
                        <ButtonContainer>
                          <JoinButton
                            {...directJoinButtonProps}
                            isSubmitting={isSubmitting}
                            onClick={this.submitData}
                          >
                            {isSubmitting ? <Spinner /> : "Join Trip"}
                          </JoinButton>
                          <AlertContainer mt="2">
                            <Alert
                              message={serverSendingError.message}
                              type="error"
                            />
                          </AlertContainer>
                        </ButtonContainer>
                      </Container>
                    ) : (
                      <NoAccountJoinTrip
                        onRequestSuccess={this.onRequestSuccess}
                        adminName={adminName}
                        email={this.email}
                        key={this.key}
                        id={id}
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              <AlertContainer mt="9">
                <Alert message={serverFetchingError.message} type="error" />
              </AlertContainer>
            )}
          </BackgroundContainer>
        )}
      </>
    );
  }
}

export default JoinTrip;
