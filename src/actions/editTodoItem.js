import {
  EDIT_TODO_ITEM_START,
  EDIT_TODO_ITEM_FAIL,
  EDIT_TODO_ITEM_SUCCESS
} from './actionConstants'

import { hideEditWindow } from './controlWindowState'

import { API_URL } from '../api'

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
      dispatch({
        type: EDIT_TODO_ITEM_SUCCESS,
        payload: {
          tripId,
          todoItemId,
          text
        }
      })
      dispatch(hideEditWindow({ tripId }))
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
