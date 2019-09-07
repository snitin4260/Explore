import {
  CREATE_TODO_ITEM_FAIL,
  CREATE_TODO_ITEM_SUCCESS
} from '../actions/actionConstants'
import { API_URL } from '../api'

export default ({ tripId, text }) => {
  return async dispatch => {
    try {
      // have to add userId and text in body
      const todoObj = {
        text
      }
      const response = await fetch(`${API_URL}/todo/create/${tripId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todoObj)
      })
      const todoData = await response.json()
      if (response.status === 201) {
        dispatch({
          type: CREATE_TODO_ITEM_SUCCESS,
          payload: {
            tripId,
            todoItemId: todoData._id,
            text,
            createdAt: todoData.createdAt
          }
        })
      } else {
        dispatch({
          type: CREATE_TODO_ITEM_FAIL,
          payload: {
            tripId,
            error: todoData.msg
          }
        })
      }
    } catch (e) {
      dispatch({
        type: CREATE_TODO_ITEM_FAIL,
        payload: {
          tripId,
          error: 'Could not Edit item. Please try again'
        }
      })
    }
  }
}
