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
    if (response.status === 200) {
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
    } else {
      dispatch({
        type: GET_ITINERARY_DATA_FAIL,
        payload: {
          tripId,
          error: data.msg
        }
      })
    }
  } catch (e) {
    dispatch({
      type: GET_ITINERARY_DATA_FAIL,
      payload: {
        tripId,
        error: 'Server is down.Please try after some time'
      }
    })
  }
}
