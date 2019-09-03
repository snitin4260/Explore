import {
  GET_ITINERARY_DATA_START,
  GET_ITINERARY_DATA_FAIL,
  GET_ITINERARY_DATA_SUCCESS
} from './actionConstants'

import { API_URL } from '../api'

export default tripId => async dispatch => {
  dispatch({
    type: GET_ITINERARY_DATA_START,
    payload: {
      tripId
    }
  })
  try {
    const response = await fetch(`${API_URL}/itinerary/${tripId}`)
    const data = await response.json()
    const { itinerary } = data
    const { day, date, location } = itinerary[0]
    const label = `Day ${day}| ${date} ${location}`
    dispatch({
      type: GET_ITINERARY_DATA_SUCCESS,
      payload: {
        tripId,
        data: itinerary,
        selectedOption: {
          label,
          value: 1
        }
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
