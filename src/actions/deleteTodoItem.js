import {
  DELETE_TODO_ITEM_FAIL,
  DELETE_TODO_ITEM_SUCCESS,
  DELETE_TODO_ITEM_START,
  ADD_DRAG_AND_DROP_DATA
} from '../actions/actionConstants'
import { API_URL } from '../api'
import { hideEditWindow } from './controlWindowState'

import { store } from '../index'
import shortid from 'shortid'

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
      const deleteObj = {
        taskId: todoItemId,
        columnId
      }
      const response = await fetch(`${API_URL}/todo/delete/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deleteObj)
      })
      if (response.status === 200) {
        const dndId = shortid.generate()
        dispatch({
          type: DELETE_TODO_ITEM_SUCCESS,
          payload: {
            tripId,
            todoItemId,
            columnId,
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
