import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { connect } from "react-redux";

import LogoHeader from "../logoHeader/LogoHeader";
import styles from "../Login/Login.module.css";
import InputLabelError from "../inputLabelError/InputLabelError";
import { getUsername,resetStatus } from "../../actions/userData";
import { API_URL } from "../../api";
import { JoinButton, Spinner } from "../trips/JoinTrip";
import { getUsernameLs } from "../../util/index";

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  getUsername: _ => {
    dispatch(getUsername());
  },
  resetStatus: _ => {
    dispatch(resetStatus())
  }
});

const SubmitButton = styled(JoinButton)``;

class Register extends React.Component {
  state = {
    redirectToTrip: false,
    redirect: false
  };

  componentDidMount() {
    const { user, getUsername } = this.props;
    if (user.userName) {
      return;
    }
    if (getUsernameLs()) {
      this.setState({
        redirectToTrip: true
      });
      return;
    }
    getUsername();
  }

  render() {
    const {user}= this.props
    const{status} = user.fetchError
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/login",
            state: { msg: "Account created successfully" }
          }}
        />
      );
    }
    if (this.state.redirectToTrip || user.userName || getUsernameLs()) {
      return <Redirect to="/trip" />;
    }

    if(!status) {
      return null
    }

    return (
      <>
        <LogoHeader />
        <div className={styles["form-box"]}>
          <div className={styles["form-inner-box"]}>
            <p className={styles["form-title"]}>Register</p>
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
              onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                  const response = await fetch(`${API_URL}/register`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(values)
                  });
                  setSubmitting(false);
                  if (response.status === 201) {
                    this.setState({
                      redirect: true
                    });
                  } else {
                    const responseData = await response.json();
                    setErrors({
                      password: responseData.msg
                    });
                  }
                } catch (e) {
                  setErrors({
                    password: "Server is down.Please try after some time"
                  });
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

                    <SubmitButton
                      type="submit"
                      isSubmitting={isSubmitting}
                      disabled={isSubmitting}
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

export default connect(mapStateToProps,mapDispatchToProps)(Register);
