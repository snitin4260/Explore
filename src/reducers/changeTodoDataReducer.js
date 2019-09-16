import produce from "immer";
import {
  SET_TRIP_TODO_OBJECT,
  CREATE_TODO_ITEM_SUCCESS,
  GET_TODO_DATA_FAIL,
  GET_TODO_DATA_START,
  GET_TODO_DATA_SUCCESS,
  SHOW_SLIDER,
  HIDE_SLIDER,
  EDIT_TODO_ITEM_START,
  EDIT_TODO_ITEM_FAIL,
  EDIT_TODO_ITEM_SUCCESS,
  DELETE_TODO_ITEM_START,
  DELETE_TODO_ITEM_FAIL,
  DELETE_TODO_ITEM_SUCCESS,
  DRAG_AND_DROP,
  SHOW_EDIT_WINDOW,
  HIDE_EDIT_WINDOW,
  RESET_TODO_STATE,
  RESET_EDIT_ERROR,
  RESET_DELETE_ERROR,
  DND_ERROR,
  RESET_DND_ERROR
} from "../actions/actionConstants";

export default (state = {}, action) => {
  switch (action.type) {
    case SET_TRIP_TODO_OBJECT: {
      return produce(state, draft => {
        draft[action.payload.tripId] = {
          error: {
            fetchingDataError: {
              status: false,
              message: ""
            },
            createTodoError: {
              status: false,
              message: ""
            },
            editItemError: {
              status: false,
              message: ""
            },
            deleteItemError: {
              status: false,
              message: ""
            },
            dndError: {
              status: false,
              message: ""
            }
          },
          dndId: null,
          isLoading: true,
          tasks: {},
          editWindowState: {
            show: false,
            todoItemId: null,
            isLoading: false
          },
          deleteItemState: {
            isLoading: false,
            todoItemId: null
          },
          columns: {
            todo: {
              id: "todo",
              title: "To-do",
              taskIds: []
            },
            inprogress: {
              id: "inprogress",
              title: "In-progress",
              taskIds: []
            },
            done: {
              id: "done",
              title: "Done",
              taskIds: []
            }
          },
          columnOrder: ["todo", "inprogress", "done"]
        };
      });
    }
    case GET_TODO_DATA_START: {
      return produce(state, draft => {
        const { tripId } = action.payload;
        const todo = draft[tripId];
        todo.isLoading = true;
      });
    }

    case DRAG_AND_DROP: {
      const {
        tripId,
        source,
        destination,
        draggableId,
        dndId
      } = action.payload;
      return produce(state, draft => {
        const todo = draft[tripId];
        todo.dndId = dndId;
        const sourceColumn = todo.columns[source.droppableId];
        sourceColumn.taskIds.splice(source.index, 1);
        const destinationColumn = todo.columns[destination.droppableId];
        destinationColumn.taskIds.splice(destination.index, 0, draggableId);
      });
    }

    case GET_TODO_DATA_SUCCESS: {
      return produce(state, draft => {
        const { tripId, data, dndId } = action.payload;
        const { tasks, columns, columnOrder } = data;
        const todo = draft[tripId];
        todo.isLoading = false;
        tasks.forEach(taskObj => {
          const { _id, text, createdAt, note } = taskObj;
          todo.tasks[_id] = {
            id: _id,
            text,
            createdAt,
            note
          };
        });
        todo.columns.todo.taskIds = columns.todo.taskIds;
        todo.columns.inprogress.taskIds = columns.inprogress.taskIds;
        todo.columns.done.taskIds = columns.done.taskIds;
        todo.columnOrder = columnOrder;
        todo.dndId = dndId;
      });
    }

    case GET_TODO_DATA_FAIL: {
      return produce(state, draft => {
        const { tripId, error } = action.payload;
        const todo = draft[tripId];
        todo.isLoading = false;
        todo.error.fetchingDataError.status = true;
        todo.error.fetchingDataError.message = error;
      });
    }
    case CREATE_TODO_ITEM_SUCCESS: {
      return produce(state, draft => {
        const { todoItemId, text, tripId, createdAt, dndId } = action.payload;
        const todo = draft[tripId];
        todo.tasks[todoItemId] = {
          id: todoItemId,
          text,
          createdAt
        };
        todo.columns.todo.taskIds.unshift(todoItemId);
        todo.dndId = dndId;
      });
    }
    case SHOW_EDIT_WINDOW: {
      return produce(state, draft => {
        const { tripId, todoItemId } = action.payload;
        const todo = draft[tripId];
        todo.editWindowState.show = true;
        todo.editWindowState.todoItemId = todoItemId;
      });
    }

    case HIDE_EDIT_WINDOW: {
      return produce(state, draft => {
        const { tripId } = action.payload;
        const todo = draft[tripId];
        todo.editWindowState.show = false;
        todo.editWindowState.todoItemId = null;
      });
    }

    case EDIT_TODO_ITEM_START: {
      return produce(state, draft => {
        const { tripId } = action.payload;
        const todo = draft[tripId];
        todo.editWindowState.isLoading = true;
      });
    }

    case EDIT_TODO_ITEM_SUCCESS: {
      return produce(state, draft => {
        const { tripId, todoItemId, text, dndId } = action.payload;
        const todo = draft[tripId];
        todo.editWindowState.isLoading = false;
        todo.tasks[todoItemId].text = text;
        todo.dndId = dndId;
      });
    }

    case EDIT_TODO_ITEM_FAIL: {
      return produce(state, draft => {
        const { tripId, error } = action.payload;
        const todo = draft[tripId];
        todo.editWindowState.isLoading = false;
        todo.error.editItemError.status = true;
        todo.error.editItemError.message = error;
      });
    }

    case DELETE_TODO_ITEM_START: {
      return produce(state, draft => {
        const { tripId, todoItemId } = action.payload;
        const todo = draft[tripId];
        todo.deleteItemState.todoItemId = todoItemId;
        todo.deleteItemState.isLoading = true;
      });
    }

    case DELETE_TODO_ITEM_SUCCESS: {
      return produce(state, draft => {
        const { tripId, todoItemId, columnId, dndId } = action.payload;
        const todo = draft[tripId];
        todo.deleteItemState.isLoading = false;
        todo.deleteItemState.todoItemId = null;
        todo.dndId = dndId;
        delete todo.tasks[todoItemId];
        const column = todo.columns[columnId];
        const itemIndex = column.taskIds.indexOf(todoItemId);
        column.taskIds.splice(itemIndex, 1);
      });
    }

    case DELETE_TODO_ITEM_FAIL: {
      return produce(state, draft => {
        const { tripId } = action.payload;
        const todo = draft[tripId];
        todo.deleteItemState.isLoading = false;
        todo.deleteItemState.todoItemId = null;
        todo.error.deleteItemError.status = true;
        todo.error.deleteItemError.message = "Item could not be deleted";
      });
    }
    case DND_ERROR: {
      return produce(state, draft => {
        const { tripId } = action.payload;
        const todo = draft[tripId];
        todo.error.dndError.status = true;
        todo.error.dndError.message =
          "Data could not be saved.Rolling back to previous data";
      });
    }

    case RESET_DND_ERROR: {
      return produce(state, draft => {
        const { tripId } = action.payload;
        const todo = draft[tripId];
        todo.error.dndError.status = false;
        todo.error.dndError.message = "";
      });
    }

    case RESET_DELETE_ERROR: {
      return produce(state, draft => {
        const { tripId } = action.payload;
        const todo = draft[tripId];
        todo.error.deleteItemError.status = false;
        todo.error.deleteItemError.message = null;
      });
    }

    case RESET_EDIT_ERROR: {
      return produce(state, draft => {
        const { tripId } = action.payload;
        const todo = draft[tripId];
        todo.error.editItemError.status = false;
        todo.error.editItemError.message = null;
      });
    }

    case RESET_TODO_STATE: {
      return produce(state, draft => {
        const { tripId, data } = action.payload;
        draft[tripId] = data;
      });
    }

    // case SHOW_SLIDER: {
    //   return produce(state, draft => {
    //     const { tripId, todoItemId } = action.payload;
    //     const todo = draft[tripId];
    //     todo.sliderState.show = true;
    //     todo.sliderState.todoItem = todoItemId;
    //   });
    // }

    // case HIDE_SLIDER: {
    //   return produce(state, draft => {
    //     const { tripId } = action.payload;
    //     const todo = draft[tripId];
    //     todo.sliderState.show = false;
    //     todo.sliderState.todoItem = null;
    //   });
    // }
    default:
      return state;
  }
};
