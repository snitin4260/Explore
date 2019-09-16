import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { connect } from "react-redux";
import styled from "styled-components";
import {store} from "../../index"
import shortid from 'shortid'

import Column from "./Column";
import createTodoItem from "../../actions/createTodoItem";
// import SlidingNote from "./SlidingNote";
import setTodoObject from "../../actions/setTodoObject";
import getTodoData from "../../actions/getTodoData";
import deleteTodoItem from "../../actions/deleteTodoItem";
import setTripObject from "../../actions/setTripObject";
import editTodoItem from "../../actions/editTodoItem";
import dragAndDropHandle from "../../actions/dragAndDropActivity";
import { dragAndDropDataSend } from "../../actions/dragAndDropActivity";
import {
  showSlider,
  hideSlider,
  showEditWindow,
  hideEditWindow
} from "../../actions/controlWindowState";
import Overlay from "../Overlay/Overlay";
import UserDashBoard from "../UserdashBoard/UserDashBoard";
import Modal from "./Modal";
import Alert from "../Alert/Alert";
import {ADD_DRAG_AND_DROP_DATA,SET_DRAG_AND_DROP_DATA_OBJECT} from "../../actions/actionConstants"

/**     Redux */
const mapStateToProps = state => ({
  todo: state.todo
});

const mapDispatchToProps = dispatch => {
  return {
    createTodoItem: ({ tripId, text }) => {
      dispatch(createTodoItem({ tripId, text }));
    },
    setTripObject: tripId => {
      dispatch(setTripObject(tripId));
    },
    showSlider: ({ tripId, todoItemId }) => {
      dispatch(showSlider({ tripId, todoItemId }));
    },
    hideSlider: ({ tripId }) => {
      dispatch(hideSlider({ tripId }));
    },
    showEditWindow: ({ tripId, todoItemId }) => {
      dispatch(showEditWindow({ tripId, todoItemId }));
    },
    hideEditWindow: ({ tripId }) => {
      dispatch(hideEditWindow({ tripId }));
    },
    setTodoObject: tripId => {
      dispatch(setTodoObject(tripId));
    },
    getTodoData: tripId => {
      dispatch(getTodoData(tripId));
    },
    editTodoItem: ({ tripId, todoItemId, text }) => {
      dispatch(editTodoItem({ tripId, todoItemId, text }));
    },
    deleteTodoItem: ({ tripId, todoItemId, columnId }) => {
      dispatch(deleteTodoItem({ tripId, todoItemId, columnId }));
    },
    dragAndDropHandle: ({ tripId, source, destination, draggableId,dndId }) => {
      dispatch(dragAndDropHandle({ tripId, source, destination, draggableId,dndId }));
    },
    dragAndDropDataSend: ({ tripId, source, destination, draggableId,dndId }) => {
      dispatch(
        dragAndDropDataSend({ tripId, source, destination, draggableId,dndId })
      );
    },
    cacheDragAndDropData : (id) => {
      dispatch({
        type: ADD_DRAG_AND_DROP_DATA,
        payload: {
          id,
          data: store.getState().todo[id]
        }
      });
    },
    setDragAndDropDataObject: (id) => {
      dispatch({
        type: SET_DRAG_AND_DROP_DATA_OBJECT,
        payload: {
          id
        }
      })
    }
  };
};

/*    Redux end **************************/

/****  styles                 */
const TodoTitle = styled.h1`
  font-family: "Ubuntu", sans-serif;
  font-size: 5rem;
  text-align: center;
  color: #222;
  margin-bottom: 1.4rem;
  text-transform: uppercase;
`;

const TodoInput = styled.input`
  display: block;
  width: 100%;
  max-width: 60rem;
  margin: 0 auto;
  text-align: left;
  background: white;
  border-radius: 100px;
  border: none;
  padding: 1rem;
  font-size: 2.4rem;
  color: var(--font-color);
  font-family: "Roboto", sans-serif;
  box-shadow: -1px -1px 13px -5px rgba(0, 0, 0, 0.64);
  font-weight: 100;
  margin-bottom: 2rem;
  &:focus {
    outline: 2px solid green;
  }
`;

const Main = styled.main`
  max-width: 960px;
  margin: 0 auto;
  height: 100%;
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  /* background: #0079bf; */
  min-height: calc(100vh - 242px);
  overflow-x: auto;
  &::-webkit-scrollbar {
    width: 1em;
  }

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  &::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
  }
`;
const Lists = styled.div`
  display: flex;
  align-items: flex-start;
  font-family: "Roboto", sans-serif;
  &::after {
    content: "";
    flex: 0 0 1rem;
    align-self: stretch;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoaderInput = styled.div`
  flex: 0 0 2rem;
  width: 100%;
  max-width: 400px;
  margin-bottom: 2rem;
`;
const LoaderColumnConatiner = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, 300px));
  grid-template-rows: 300px;
  grid-column-gap: 10px;
`;

/*************** styles end */

class TodoApp extends React.Component {
  state = {
    text: ""
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    const {
      setTodoObject,
      setTripObject,
      getTodoData,
      setDragAndDropDataObject
    } = this.props;
    setTripObject(id);
    setTodoObject(id);
    getTodoData(id);
    setDragAndDropDataObject(id)
  }

  handleChange = e => {
    const { value } = e.target;
    console.log(e);
    if (value.length <= 70)
      this.setState({
        text: value
      });
  };

  handleSubmit = e => {
    if (e.which !== 13 || this.state.text.trim() === "") return;
    const { createTodoItem } = this.props;
    const { id } = this.props.match.params;
    createTodoItem({
      text: this.state.text,
      tripId: id
    });
    this.setState({
      text: ""
    });
  };

  onDragEnd = result => {
    const { dragAndDropHandle, dragAndDropDataSend,cacheDragAndDropData } = this.props;
    const { id } = this.props.match.params;
    const { destination, source, draggableId } = result;
    if (!destination) return;
    // same column and same position of draggable
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const dndId = shortid.generate()
    dragAndDropHandle({
      tripId: id,
      destination,
      source,
      draggableId,
      dndId
    });

    cacheDragAndDropData(id)

    dragAndDropDataSend({
      tripId: id,
      destination,
      source,
      draggableId,
      dndId
    });
  };

  getExactTripTodo() {
    const { id } = this.props.match.params;
    const { todo } = this.props;
    return todo[id];
  }

  displayEditWindow() {
    const { id } = this.props.match.params;
    const { todo } = this.props;
    return todo[id].editWindowState.show;
  }

  getEditItemDetails() {
    const { id } = this.props.match.params;
    const { todo } = this.props;
    console.log(todo);
    const todoItemId = todo[id].editWindowState.todoItemId;
    const text = todo[id].tasks[todoItemId].text;
    return {
      text,
      todoItemId
    };
  }

  render() {
    const { id } = this.props.match.params;
    const {
      showSlider,
      showEditWindow,
      hideEditWindow,
      editTodoItem,
      deleteTodoItem,
      todo
    } = this.props;
    if (!this.getExactTripTodo()) return null;
    const {
      columnOrder,
      columns,
      tasks,
      error,
      isLoading
    } = this.getExactTripTodo();
    return (
      <UserDashBoard selected="todo">
        <Main>
          {error.fetchingDataError.status ? (
            <Alert type="error" message={error.fetchingDataError.message}/>
          ) : (
            <>
              <TodoTitle>Todo</TodoTitle>
              {isLoading ? (
                <LoaderContainer>
                  <LoaderInput className="loadingDiv"></LoaderInput>
                  <LoaderColumnConatiner>
                    <div className="loadingDiv" />
                    <div className="loadingDiv" />
                    <div className="loadingDiv" />
                  </LoaderColumnConatiner>
                </LoaderContainer>
              ) : (
                <>
                  <TodoInput
                    onKeyPress={this.handleSubmit}
                    onChange={this.handleChange}
                    value={this.state.text}
                    placeholder="What needs to be done?"
                    autoFocus
                  />

                  <Container>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                      <Lists className="lists">
                        {columnOrder.map(columnId => {
                          const column = columns[columnId];
                          const taskDetailArray = column.taskIds.map(
                            taskId => tasks[taskId]
                          );
                          return (
                            <Column
                              showEditWindow={showEditWindow}
                              deleteTodoItem={deleteTodoItem}
                              showSlider={showSlider}
                              column={column}
                              tripId={id}
                          
                              key={columnId}
                              tasks={taskDetailArray}
                              deleteItemState={
                                this.getExactTripTodo().deleteItemState
                              }
                            />
                          );
                        })}
                      </Lists>
                    </DragDropContext>
                  </Container>
                </>
              )}
              {this.displayEditWindow() && <Overlay />}
              {this.displayEditWindow() && (
                <Modal
                  tripId={id}
                  hideEditWindow={hideEditWindow}
                  taskItem={this.getEditItemDetails()}
                  editTodoItem={editTodoItem}
                  editWindowState={this.getExactTripTodo().editWindowState}
                />
              )}
            </>
          )}
        </Main>
      </UserDashBoard>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoApp);
