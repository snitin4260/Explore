import React from "react";
import LogoHeader from "../logoHeader/LogoHeader";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import styles from "../Login/Login.module.css";
import InputLabelError from "../inputLabelError/InputLabelError";
import { API_URL } from "../../api";
import { Redirect } from "react-router-dom";

class Register extends React.Component {
  state = {
    redirect: false
  };
  render() {
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
              onSubmit={async (values, { setSubmitting,setErrors }) => {
                try {
                const response = await fetch(`${API_URL}/register`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(values)
                });
                if (response.status === 201) {
                  this.setState({
                    redirect: true
                  })
                } else {
                  const responseData = await response.json();
                  setErrors({
                    password: responseData.msg
                    
                  })
                  
                }
              }
              catch(e) {
                setErrors({
                  password: 'Server is down.Please try after some time'
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
      </>
    );
  }
}

export default Register;
