import {
  GET_TODO_DATA_FAIL,
  GET_TODO_DATA_SUCCESS,
  GET_TODO_DATA_START
} from './actionConstants'

import { API_URL } from '../api'

export default tripId => async dispatch => {
  dispatch({
    type: GET_TODO_DATA_START,
    payload: {
      tripId
    }
  })
  try {
    const response = await fetch(`${API_URL}/todo/${tripId}`)
    if (response.status === 200) {
      const todoData = await response.json()
      dispatch({
        type: GET_TODO_DATA_SUCCESS,
        payload: {
          tripId,
          data: {
            tasks: todoData.tasks,
            columns: todoData.columns,
            columnOrder: todoData.columnOrder
          }
        }
      })
    }
  } catch (e) {
    dispatch({
      type: GET_TODO_DATA_FAIL,
      payload: {
        tripId,
        error: e
      }
    })
  }
}
