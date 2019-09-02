import {
  GET_ITINERARY_DATA_START,
  GET_ITINERARY_DATA_FAIL,
  GET_ITINERARY_DATA_SUCCESS
} from './actionConstants'

import { API_URL } from '../api'

export default tripId => async dispatch => {
  dispatch({ type: GET_ITINERARY_DATA_START,
    payload: {
      tripId
    } })
  try {
    const response = await fetch(`${API_URL}/itinerary/${tripId}`)
    const itineraryData = await response.json()
    dispatch({
      type: GET_ITINERARY_DATA_SUCCESS,
      payload: {
        tripId,
        data: itineraryData
      }
    })
  } catch (e) {
    dispatch({
      type: GET_ITINERARY_DATA_FAIL,
      payload: {
        tripId,
        error: e
      }
    })
  }
}
