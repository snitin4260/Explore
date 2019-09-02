import {
  DELETE_TODO_ITEM_FAIL,
  DELETE_TODO_ITEM_SUCCESS,
  DELETE_TODO_ITEM_START
} from '../actions/actionConstants'
import { API_URL } from '../api'
import { hideEditWindow } from './controlWindowState'

export default ({ tripId, todoItemId, columnId }) => {
  return async dispatch => {
    try {
      // have to add userId and text in body
      dispatch({
        type: DELETE_TODO_ITEM_START,
        payload: {
          tripId,
          todoItemId
        }
      })
      const response = await fetch(`${API_URL}/todo/delete/${tripId}`, {
        method: 'DELETE',
        body: {
          tripId,
          taskId: todoItemId,
          columnId
        }
      })
      if (response.status === 200) {
        dispatch({
          type: DELETE_TODO_ITEM_SUCCESS,
          payload: {
            tripId,
            todoItemId,
            columnId
          }
        })
        dispatch(hideEditWindow({ tripId }))
      } else {
        const responseObject = await response.json()
        dispatch({
          type: DELETE_TODO_ITEM_FAIL,
          payload: {
            tripId,
            error: responseObject.msg
          }
        })
      }
    } catch (e) {
      dispatch({
        type: DELETE_TODO_ITEM_FAIL,
        payload: {
          tripId,
          error: 'Could not fetch data. Please try again'
        }
      })
    }
  }
}
