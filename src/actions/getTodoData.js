import shortid from 'shortid'

import {
  GET_TODO_DATA_FAIL,
  GET_TODO_DATA_SUCCESS,
  GET_TODO_DATA_START,
  ADD_DRAG_AND_DROP_DATA
} from './actionConstants'

import { API_URL } from '../api'
import { store } from '../index'

export default tripId => async dispatch => {
  dispatch({
    type: GET_TODO_DATA_START,
    payload: {
      tripId
    }
  })
  try {
    const response = await fetch(`${API_URL}/todo/${tripId}`)
    const todoData = await response.json()
    if (response.status === 200) {
      const dndId = shortid.generate()
      dispatch({
        type: GET_TODO_DATA_SUCCESS,
        payload: {
          tripId,
          data: {
            tasks: todoData.tasks,
            columns: todoData.columns,
            columnOrder: todoData.columnOrder
          },
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
        type: GET_TODO_DATA_FAIL,
        payload: {
          tripId,
          error: todoData.msg
        }
      })
    }
  } catch (e) {
    dispatch({
      type: GET_TODO_DATA_FAIL,
      payload: {
        tripId,
        error: 'Server is down. Try after some time'
      }
    })
  }
}
