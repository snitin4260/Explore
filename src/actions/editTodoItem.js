import {
  EDIT_TODO_ITEM_START,
  EDIT_TODO_ITEM_FAIL,
  EDIT_TODO_ITEM_SUCCESS,
  ADD_DRAG_AND_DROP_DATA
} from './actionConstants'

import { hideEditWindow } from './controlWindowState'

import { API_URL } from '../api'
import { store } from '../index'
import shortid from 'shortid'

export default ({ tripId, todoItemId, text }) => async dispatch => {
  dispatch({
    type: EDIT_TODO_ITEM_START,
    payload: {
      tripId
    }
  })
  try {
    const editObj = {
      taskId: todoItemId,
      text
    }
    const response = await fetch(`${API_URL}/todo/edit/${tripId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editObj)
    })
    if (response.status === 200) {
      const dndId = shortid.generate()
      dispatch({
        type: EDIT_TODO_ITEM_SUCCESS,
        payload: {
          tripId,
          todoItemId,
          text,
          dndId
        }
      })
      dispatch(hideEditWindow({ tripId }))
      dispatch({
        type: ADD_DRAG_AND_DROP_DATA,
        payload: {
          id: tripId,
          data: store.getState().todo[tripId]
        }
      })
    } else {
      const responseObject = await response.json()
      dispatch({
        type: EDIT_TODO_ITEM_FAIL,
        payload: {
          tripId,
          error: responseObject.msg
        }
      })
    }
  } catch (e) {
    dispatch({
      type: EDIT_TODO_ITEM_FAIL,
      payload: {
        tripId,
        error: 'Server is down. Please try again later'
      }
    })
  }
}
