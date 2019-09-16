import {
  CREATE_TODO_ITEM_FAIL,
  CREATE_TODO_ITEM_SUCCESS,
  ADD_DRAG_AND_DROP_DATA
} from '../actions/actionConstants'
import { API_URL } from '../api'
import { store } from '../index'
import shortid from 'shortid'

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
        const dndId = shortid.generate()
        dispatch({
          type: CREATE_TODO_ITEM_SUCCESS,
          payload: {
            tripId,
            todoItemId: todoData._id,
            text,
            createdAt: todoData.createdAt,
            dndId
          }
        })
        dispatch({
          type: ADD_DRAG_AND_DROP_DATA,
          payload: {
            id: tripId,
            data: store.getState().todo[tripId]
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
