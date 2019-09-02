import {
  GET_ALL_TRIP_DATA_START,
  GET_ALL_TRIP_DATA_SUCCESS,
  GET_ALL_TRIP_DATA_FAIL
} from './actionConstants'

import { API_URL } from '../api'

export default () => async dispatch => {
  dispatch({ type: GET_ALL_TRIP_DATA_START })

  try {
    const response = await fetch(`${API_URL}/trip/all`)
    console.log(response)
    const responseObject = await response.json()
    dispatch({
      type: GET_ALL_TRIP_DATA_SUCCESS,
      payload: { trips: responseObject.allTripData }
    })
  } catch (err) {
    dispatch({
      type: GET_ALL_TRIP_DATA_FAIL,
      payload: {
        error: err
      }
    })
  }
}
