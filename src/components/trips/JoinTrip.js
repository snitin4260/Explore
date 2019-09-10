import React from "react";
import { Formik, Form } from "formik";
import { Redirect } from "react-router-dom";
import queryString from "query-string";
import * as Yup from "yup";
import styled from "styled-components";

import LogoHeader from "../logoHeader/LogoHeader";
import styles from "../Login/Login.module.css";
import InputLabelError from "../inputLabelError/InputLabelError";
import { API_URL } from "../../api";
import BackgroundContainer from "../BackgroundContainer/BackgroundContainer";
import Alert from "../Alert/Alert";

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

const JoinButton = styled.button`
  text-transform: uppercase;
  color: white;
  background-color: var(--main-bg-color);
  border: 0;
  width: 100%;
  font-weight: 600;
  padding: 1.2rem 1rem;
cursor: ${props => {
  return props.isSubmitting? 'not-allowed': 'pointer'
}};
  font-size: 1.5rem;
  font-family: "Roboto", sans-serif;
`;

class JoinTrip extends React.Component {
  state = {
    redirect: false,
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
        email: this.email
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
          redirect: true,
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
    const { email } = queryString.parse(search);
    // store result for later use
    this.email = email;
    try {
      const emailObj = {
        email
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

  render() {
    const {
      isFetching,
      hasAccount,
      serverFetchingError,
      serverSendingError,
      adminName,
      isSubmitting
    } = this.state;
    const directJoinButtonProps ={
      disabled: isSubmitting
    }
    const { id } = this.props.match.params;
    if (this.state.redirect) {
      const msg = hasAccount
        ? `You have been added to ${adminName}'s group. Please login`
        : `Account created. You have been added ${adminName}'s group `;
      return (
        <Redirect
          to={{
            pathname: "/login",
            state: { msg }
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
                {hasAccount ? (
                  <Container>
                    <ButtonContainer>
                      <JoinButton {...directJoinButtonProps} isSubmitting={isSubmitting} onClick={this.submitData}>
                        Join Trip
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
                  <div className={styles["form-box"]}>
                    <div className={styles["form-inner-box"]}>
                      <p className={styles["form-title"]}>
                        Join {adminName}'s trip
                      </p>
                      <Formik
                        validationSchema={Yup.object().shape({
                          password: Yup.string()
                            .min(8, "Password is too small")
                            .max(13)
                            .required("Password required"),
                          email: Yup.string()
                            .email("Email must be of valid format")
                            .required("Email required"),
                          name: Yup.string().required("Name required")
                        })}
                        onSubmit={async (
                          values,
                          { setSubmitting, setErrors }
                        ) => {
                          try {
                            const formObj ={
                              ...values,
                              type: 'form'
                            }
                            const response = await fetch(
                              `${API_URL}/trip/user/add/${id}`,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify(formObj)
                              }
                            );
                            if (response.status === 200) {
                              this.setState({
                                redirect: true
                              });
                            } else {
                              const responseData = await response.json();
                              setErrors({password: responseData.msg})
                            }
                          } catch (e) {
                            setErrors({
                              password: 'Server is Down. Please try after some time.'
                            })
                          }
                        }}
                        initialValues={{ password: "", name: "", email: "" }}
                      >
                        {({ isSubmitting }) => {
                          return (
                            <Form>
                              <InputLabelError
                                inputName="name"
                                inputType="text"
                                inputLabel="Name"
                              />
                              <InputLabelError
                                inputName="email"
                                inputType="email"
                                inputLabel="Email"
                              />
                              <InputLabelError
                                inputName="password"
                                inputType="password"
                                inputLabel="Password"
                              />

                              <button
                                type="submit"
                                className={styles["form-submit-button"]}
                                disabled={isSubmitting}
                              >
                                Submit
                              </button>
                            </Form>
                          );
                        }}
                      </Formik>
                    </div>
                  </div>
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
