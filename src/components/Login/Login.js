import React from "react";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

import LogoHeader from "../logoHeader/LogoHeader";
import InputLabelError from "../inputLabelError/InputLabelError";
import styles from "./Login.module.css";
import { API_URL } from "../../api";
import { updateUsername, getUsername } from "../../actions/userData";
import { getUsernameLs } from "../../util/index";
import { JoinButton, Spinner } from "../trips/JoinTrip";

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  updateUsername: name => {
    dispatch(updateUsername(name));
  },
  getUsername: _ => {
    dispatch(getUsername());
  }
});

const SuccessMessage = styled.div`
  width: 100%;
  padding: 1rem;
  margin-top: 9rem;
  color: white;
  font-size: 2rem;
  text-align: center;
  background: green;
  font-family: "Roboto", sans-serif;
`;

const SubmitButton = styled(JoinButton)``;

class Login extends React.Component {
  state = {
    redirect: false,
    redirectToOrigin: false
  };

  componentDidMount() {
    this.hasUnmounted = false;
    //
    const { user, getUsername } = this.props;
    if (user.userName || getUsernameLs()) {
      return;
    }

    getUsername();
  }

  componentWillUnmount() {
    this.hasUnmounted = true;
  }

  render() {
    const { user } = this.props;
    const { state } = this.props.location;
    const { status } = user.fetchError;

    if (this.state.redirect || user.userName || getUsernameLs()) {
      return state && state.from ? (
        <Redirect to={`${this.props.location.state.from.pathname}`} />
      ) : (
        <Redirect to="/trip" />
      );
    }

    //user data is not there in localSt and redux store
    // making request to server to know whether user is logged in
    //return null until then
    if (!status) return null;
    return (
      <>
        <LogoHeader />
        {state && state.msg && <SuccessMessage>{state.msg}</SuccessMessage>}
        <div className={styles["form-box"]}>
          <div className={styles["form-inner-box"]}>
            <p className={styles["form-title"]}>Sign in</p>
            <Formik
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email("Email must be of valid format")
                  .required("Email required"),
                password: Yup.string().required("Password required")
              })}
              onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                  const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(values)
                  });
                  setSubmitting(false);
                  const responseObject = await response.json();
                  if (response.status === 200) {
                    this.props.updateUsername(responseObject.userName);
                    //update the localStorage
                    localStorage.setItem(
                      "user",
                      JSON.stringify({
                        userName: responseObject.userName
                      })
                    );
                  } else {
                    setErrors({
                      password: responseObject.msg
                    });
                  }
                } catch (e) {
                  setErrors({
                    password: "Server is down.Please try after some time"
                  });
                }
              }}
              initialValues={{ email: "", password: "" }}
            >
              {({ isSubmitting }) => {
                return (
                  <Form>
                    <InputLabelError
                      inputName="email"
                      inputType="text"
                      inputLabel="Email"
                    />
                    <InputLabelError
                      inputName="password"
                      inputType="password"
                      inputLabel="Password"
                    />

                    <SubmitButton
                      type="submit"
                      disabled={isSubmitting}
                      isSubmitting={isSubmitting}
                    >
                      {isSubmitting ? <Spinner /> : "Submit"}
                    </SubmitButton>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
