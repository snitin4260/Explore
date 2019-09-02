import {
  GET_TRIPS_COUNT_START,
  GET_TRIPS_COUNT_SUCCESS,
  GET_TRIPS_COUNT_FAIL
} from './actionConstants'

import { API_URL } from '../api'

export default () => async dispatch => {
  dispatch({ type: GET_TRIPS_COUNT_START })

  try {
    const response = await fetch(`${API_URL}/trip/count`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    if (response.status === 200) {
      const tripCountObject = await response.json()
      dispatch({
        type: GET_TRIPS_COUNT_SUCCESS,
        payload: { tripCount: tripCountObject.tripCount }
      })
    }
  } catch (err) {
    dispatch({
      type: GET_TRIPS_COUNT_FAIL,
      payload: {
        error: err
      }
    })
  }
}
