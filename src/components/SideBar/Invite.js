import React from "react";
import styled from "styled-components";
import uuid from "uuid";
import * as yup from "yup";

import Alert from "../Alert/Alert";
import { Loader } from "../Todo/Modal";
import { RounDiv, CloseSvg } from "../trips/CreateTrip";
import {
  LocationInput,
  DeleteSvg,
  SaveButton,
  AddSvgContainer,
  AddSvg,
  ItineraryLoader
} from "../Itinerary/ItineraryEditItem";
import {API_URL} from '../../api/index'


let validEmailSchema = yup.object().shape({
  id: yup.string(),
  text: yup
    .string()
    .email()
    .min(1)
});

const InviteWindow = styled.div`
  background: white;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 500;
  overflow: auto;
`;

const InviteForm = styled.form`
  margin-top: 2rem;
`;

const CloseContainer = styled(RounDiv)`
  background: var(--main-bg-color);
`;
const InviteCloseSvg = styled(CloseSvg)`
  color: white;
`;

const Content = styled.div`
  margin-top: 9rem;
`;

const Container = styled.div`
  max-width: 40rem;
  margin: 0 auto;
  font-family: "Roboto", sans-serif;
`;

const Title = styled.h2`
  font-size: 4rem;
  text-align: center;
`;

const SecondaryHeader = styled.p`
  font-size: 2rem;
  text-align: center;
  font-weight: 100;
  color: var(--font-color);
`;

const InviteInputContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const InviteInput = styled(LocationInput)`
  margin-right: 1rem;
  display: inline-block;
  flex-grow: 1;
  border: ${props => {
    const { validationError, index } = props;
    if (validationError.length === 0 || validationError[index] === true) {
      return `2px solid rgb(220, 220, 220)`;
    }

    // when new email id is added after validation
    // cannot be any other falsy values
    if (validationError[index] === undefined) {
      return `2px solid rgb(220, 220, 220)`;
    }
    return "2px solid red";
  }};
`;

const InviteButton = styled(SaveButton)`
  margin-top: 1.5rem;
  margin-bottom: 1rem;
`;

const InviteButtonConatiner = styled.div`
  margin-top: 2rem;
  position: relative;
`;

const AddEmailContainer = styled.div`
  margin-bottom: 1rem;
`;

const AddEmailText = styled.span`
  color: black;
  margin-left: 1rem;
  font-size: 1.6rem;
`;

class Invite extends React.Component {
  state = {
    emails: [
      {
        id: uuid.v4(),
        text: ""
      }
    ],
    validationError: [],
    serverErrorMessage: "",
    successMessage: "",
    validationErrorMessage: "",
    isSendingData: false
  };

  checkEmailValidity = async _ => {
    const result = await Promise.all(
      this.state.emails.map(async email => {
        return await validEmailSchema.isValid(email);
      })
    );
    //loop result and check all are true
    let isValid = true;
    for (let i = 0; i < result.length; i++) {
      if (result[i] === false) {
        isValid = false;
        break;
      }
    }

    return {
      isValid,
      result
    };
  };

  removeErrorMessage() {
    if (this.state.validationErrorMessage) {
      this.setState({
        validationErrorMessage: "",
        validationError:[]
      });
      return;
    }
    if (this.state.serverErrorMessage) {
      this.setState({
        serverErrorMessage: ""
      });
    }

    if (this.state.successMessage) {
      this.setState({
        successMessage: ""
      });
    }
  }

  sendDataToServer = async _ => {
    const { tripId } = this.props;
    try {
      // have to add userId and text in body
      this.setState({
        isSendingData: true
      });
      const inviteObj = {
        email: this.state.emails,
      };
      const response = await fetch(`${API_URL}/invite/${tripId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inviteObj)
      });
      const invite = await response.json();
      this.setState({
        isSendingData: false
      });
      if (response.status === 200) {
        this.setState({
          successMessage: "Email Sent"
        });
      } else {
        this.setState({
          serverErrorMessage: invite.msg
        });
      }
    } catch (e) {
      this.setState({
        serverErrorMessage: "Server is down. Please try after some time",
        isSendingData: false
      });
    }
  }

  handleSubmit = async e => {
    e.preventDefault();
    this.removeErrorMessage()
    const response = await this.checkEmailValidity();
    const { isValid, result } = response;
    if (!isValid) {
      this.setState({
        validationError: result,
        validationErrorMessage:
          "Highlighted emails are invalid.Please enter valid email"
      });
      return;
    }
    this.sendDataToServer()

  };

  handleInputChange = (e, id) => {
    this.removeErrorMessage();
    const { value } = e.target;
    const newEmails = this.state.emails.map(emailObj => {
      if (emailObj.id === id) {
        return {
          ...emailObj,
          text: value
        };
      }
      return emailObj;
    });
    this.setState({
      emails: newEmails
    });
  };

  insertNewEmail = _ => {
    this.removeErrorMessage();
    const newId = uuid.v4();
    const newEmails = Array.from(this.state.emails);
    newEmails.push({
      id: newId,
      text: ""
    });
    this.setState({
      emails: newEmails
    });
  };

  deleteEmailItem = id => {
    this.removeErrorMessage();
    const newEmails = this.state.emails.filter(emailObj => {
      if (emailObj.id !== id) {
        return true;
      }

      return false;
    });

    this.setState({
      emails: newEmails
    });
  };

  closeWindow = _ => {
    const { hideInviteWindow } = this.props;
    hideInviteWindow();
  };

  componentDidMount() {
    document.body.style.overflow = "hidden";
  }

  componentWillUnmount() {
    document.body.style.overflow = "visible";
  }

  render() {
    const {
      emails,
      isSendingData,
      successMessage,
      validationError,
      validationErrorMessage,
      serverErrorMessage
    } = this.state;
    const buttonProps= {
      disabled: isSendingData
    }
    return (
      <InviteWindow>
        <CloseContainer
          isSubmitting={isSendingData}
          {...buttonProps}
          onClick={this.closeWindow}
        >
          <InviteCloseSvg
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 352 512"
          >
            <path
              fill="currentColor"
              d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
            ></path>
          </InviteCloseSvg>
        </CloseContainer>
        <Content>
          <Container>
            <Title>Invite</Title>
            <SecondaryHeader>
              Fill in the email address of the people you’d like to invite.
            </SecondaryHeader>
            <InviteForm onSubmit={this.handleSubmit}>
              {emails.map((email, index) => {
                return (
                  <InviteInputContainer key={email.id}>
                    <InviteInput
                      type="email"
                      index={index}
                      placeholder="name@example.com"
                      validationError={validationError}
                      value={email.text}
                      onChange={e => this.handleInputChange(e, email.id)}
                    />
                    <DeleteSvg
                      onClick={() => this.deleteEmailItem(email.id)}
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path
                        fill="currentColor"
                        d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"
                      />
                    </DeleteSvg>
                  </InviteInputContainer>
                );
              })}
              <AddEmailContainer>
                <AddSvgContainer onClick={this.insertNewEmail}>
                  <AddSvg
                    aria-hidden="true"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
                    ></path>
                  </AddSvg>
                </AddSvgContainer>
                <AddEmailText>Add Email</AddEmailText>
              </AddEmailContainer>
              <Alert message={validationErrorMessage} type="error" />
              <Alert message={successMessage} type="success" />
              <Alert message={serverErrorMessage} type="error" />
              <InviteButtonConatiner>
                <InviteButton isSendingData={isSendingData} {...buttonProps}>
                  Send Invite
                </InviteButton>
                <ItineraryLoader isSendingData={isSendingData}/>
              </InviteButtonConatiner>
            </InviteForm>
          </Container>
        </Content>
      </InviteWindow>
    );
  }
}

export default Invite;
