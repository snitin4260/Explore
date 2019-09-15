import React ,{useState} from "react"
import { Formik, Form } from "formik";
import * as Yup from "yup";

import styles from "../Login/Login.module.css";
import InputLabelError from "../inputLabelError/InputLabelError";
import { API_URL } from "../../api";
import {Spinner, JoinButton} from "./JoinTrip"


function NoAccountJoinTrip (props) {
    const { adminName, id, email, key, onRequestSuccess } = props;
    return (
      <div className={styles["form-box"]}>
        <div className={styles["form-inner-box"]}>
          <p className={styles["form-title"]}>Join {adminName}'s trip</p>
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
                const formObj = {
                  ...values,
                  key,
                  type: "form"
                };
                const response = await fetch(`${API_URL}/trip/user/add/${id}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(formObj)
                });
                if (response.status === 200) {
                  onRequestSuccess()
                  
                } else {
                  const responseData = await response.json();
                  setErrors({ password: responseData.msg });
                }
              } catch (e) {
                setErrors({
                  password: "Server is Down. Please try after some time."
                });
              }
            }}
            initialValues={{ password: "", name: "", email   }}
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
                    disabled="true"
                  />
                  <InputLabelError
                    inputName="password"
                    inputType="password"
                    inputLabel="Password"
                  />

                  <JoinButton
                    type="submit"
                    disabled={isSubmitting}
                    isSubmitting={isSubmitting}
                  >
                    {isSubmitting ? <Spinner /> : "SUBMIT"}
                  </JoinButton>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    );
        
}

export default NoAccountJoinTrip