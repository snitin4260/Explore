import produce from 'immer'
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
  HIDE_EDIT_WINDOW
} from '../actions/actionConstants'

export default (state = {}, action) => {
  switch (action.type) {
    case SET_TRIP_TODO_OBJECT: {
      return produce(state, draft => {
        draft[action.payload.tripId] = {
          error: {
            fetchingDataError: {
              status: false,
              message: ''
            },
            createTodoError: false,
            editItemError: false,
            deleteItemError: false
          },
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
              id: 'todo',
              title: 'To-do',
              taskIds: []
            },
            inprogress: {
              id: 'inprogress',
              title: 'In-progress',
              taskIds: []
            },
            done: {
              id: 'done',
              title: 'Done',
              taskIds: []
            }
          },
          columnOrder: ['todo', 'inprogress', 'done']
        }
      })
    }
    case GET_TODO_DATA_START: {
      return produce(state, draft => {
        const { tripId } = action.payload
        const todo = draft[tripId]
        todo.isLoading = true
      })
    }

    case DRAG_AND_DROP: {
      const { tripId, source, destination, draggableId } = action.payload
      return produce(state, draft => {
        const todo = draft[tripId]
        const sourceColumn = todo.columns[source.droppableId]
        sourceColumn.taskIds.splice(source.index, 1)
        const destinationColumn = todo.columns[destination.droppableId]
        destinationColumn.taskIds.splice(destination.index, 0, draggableId)
      })
    }

    case GET_TODO_DATA_SUCCESS: {
      return produce(state, draft => {
        const { tripId, data } = action.payload
        const { tasks, columns, columnOrder } = data
        const todo = draft[tripId]
        todo.isLoading = false
        tasks.forEach(taskObj => {
          const { _id, text, createdAt, note } = taskObj
          todo.tasks[_id] = {
            id: _id,
            text,
            createdAt,
            note
          }
        })
        todo.columns.todo.taskIds = columns.todo.taskIds
        todo.columns.inprogress.taskIds = columns.inprogress.taskIds
        todo.columns.done.taskIds = columns.done.taskIds
        todo.columnOrder = columnOrder
      })
    }

    case GET_TODO_DATA_FAIL: {
      return produce(state, draft => {
        const { tripId, error } = action.payload
        const todo = draft[tripId]
        todo.isLoading = false
        todo.error.fetchingDataError.status = true
        todo.error.fetchingDataError.message = error
      })
    }
    case CREATE_TODO_ITEM_SUCCESS: {
      return produce(state, draft => {
        const { todoItemId, text, tripId, createdAt } = action.payload
        const todo = draft[tripId]
        todo.tasks[todoItemId] = {
          id: todoItemId,
          text,
          createdAt
        }
        todo.columns.todo.taskIds.unshift(todoItemId)
      })
    }
    case SHOW_EDIT_WINDOW: {
      return produce(state, draft => {
        const { tripId, todoItemId } = action.payload
        const todo = draft[tripId]
        todo.editWindowState.show = true
        todo.editWindowState.todoItemId = todoItemId
      })
    }

    case HIDE_EDIT_WINDOW: {
      return produce(state, draft => {
        const { tripId } = action.payload
        const todo = draft[tripId]
        todo.editWindowState.show = false
        todo.editWindowState.todoItemId = null
      })
    }

    case EDIT_TODO_ITEM_START: {
      return produce(state, draft => {
        const { tripId } = action.payload
        const todo = draft[tripId]
        todo.editWindowState.isLoading = true
      })
    }

    case EDIT_TODO_ITEM_SUCCESS: {
      return produce(state, draft => {
        const { tripId, todoItemId, text } = action.payload
        const todo = draft[tripId]
        todo.editWindowState.isLoading = false
        todo.tasks[todoItemId].text = text
      })
    }

    case EDIT_TODO_ITEM_FAIL: {
      return produce(state, draft => {
        const { tripId, error } = action.payload
        const todo = draft[tripId]
        todo.editWindowState.isLoading = false
        todo.error.editItemError = error
      })
    }

    case DELETE_TODO_ITEM_START: {
      return produce(state, draft => {
        const { tripId, todoItemId } = action.payload
        const todo = draft[tripId]
        todo.deleteItemState.todoItemId = todoItemId
        todo.deleteItemState.isLoading = true
      })
    }

    case DELETE_TODO_ITEM_SUCCESS: {
      return produce(state, draft => {
        const { tripId, todoItemId, columnId } = action.payload
        const todo = draft[tripId]
        todo.deleteItemState.isLoading = false
        todo.deleteItemState.todoItemId = null
        delete todo.tasks[todoItemId]
        const column = todo.columns[columnId]
        const itemIndex = column.taskIds.indexOf(todoItemId)
        column.taskIds.splice(itemIndex, 1)
      })
    }

    case DELETE_TODO_ITEM_FAIL: {
      return produce(state, draft => {
        const { tripId } = action.payload
        const todo = draft[tripId]
        todo.deleteItemState.isLoading = false
        todo.deleteItemState.todoItemId = null
        todo.error.deleteItemError = true
      })
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
      return state
  }
}
