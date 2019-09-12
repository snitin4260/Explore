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
import { updateUsername } from "../../actions/userData";

const mapDispatchToProps = dispatch => ({
  updateUsername: name => {
    dispatch(updateUsername(name));
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

class Login extends React.Component {
  state = {
    redirect: false
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to="/trip" />;
    }
    const { state } = this.props.location;
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
                    this.setState({
                      redirect: true
                    });
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
      </>
    );
  }
}
export default connect(
  null,
  mapDispatchToProps
)(Login);
