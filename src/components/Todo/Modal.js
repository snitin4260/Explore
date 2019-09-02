import React from "react";
import styled, { keyframes } from "styled-components";
import ErrorDisplay from "../ErrorDisplay/ErrorDisplay";

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const SaveButton = styled.button`
  padding: 1rem;
  background: green;
  color: white;
  border: none;
  margin-right: 2rem;
  cursor: ${props => (props.isLoading ? "not-allowed" : "pointer")}
  font-family: "Roboto", sans-serif;
  font-size: 1.2rem;
  
`;
const CancelButton = styled(SaveButton)`
  background: red;
  cursor: ${props => (props.isLoading ? "not-allowed" : "pointer")};
`;
const TextArea = styled.textarea`
  width: 100%;
  height: 8rem;
  max-width: 30rem;
  margin-bottom: 1rem;
  padding: 1rem;
  font-size: 1.5rem;
  border: 2px;
  resize: none;
`;
const rotate = keyframes`
 0%    { transform: rotate(0deg); }
  100%  { transform: rotate(360deg); }
`;
export const Loader = styled.div`
    height: 28px;
    width: 28px;
    animation: ${rotate} 0.8s infinite linear;
    border: 8px solid green;
    border-right-color: transparent;
    border-radius: 50%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
`;

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.taskItem.text
    };
    this.textAreaInput = React.createRef();
  }

  componentDidMount() {
    // to transfer the focus after last character in text
    this.textAreaInput.current.value = ``;
    this.textAreaInput.current.value = this.state.text;
    this.textAreaInput.current.focus();
  }

  handleChange = e => {
    const { value } = e.target;
    if (value.length <= 70)
      this.setState({
        text: value
      });
  };

  render() {
    const {
      tripId,
      taskItem,
      hideEditWindow,
      editTodoItem,
      editWindowState
    } = this.props;
    const { isLoading } = editWindowState;
    const { todoItemId } = taskItem;
    const { text } = this.state;
    const buttonProps = {
      disabled: isLoading
    };
    return (
      <ModalContainer className="modal">
        {isLoading && <Loader />}
        {/* <ErrorDisplay /> */}
        <TextArea
          ref={this.textAreaInput}
          value={this.state.text}
          onChange={this.handleChange}
        />
        <div>
          <SaveButton
            isLoading={isLoading}
            onClick={() => {
              if(text.trim()===''|| text=== taskItem.text){
                hideEditWindow({ tripId });
              }
              else {
              editTodoItem({ tripId, todoItemId, text });
              }
            }}
            {...buttonProps}
          >
            SAVE
          </SaveButton>
          <CancelButton
            isLoading={isLoading}
            onClick={() => {
              hideEditWindow({ tripId });
            }}
            {...buttonProps}
          >
            CANCEL
          </CancelButton>
        </div>
      </ModalContainer>
    );
  }
}

export default Modal;
