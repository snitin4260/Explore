import { SET_ITINERARY_TRIP_OBJECT } from './actionConstants'

export default tripId => ({
  type: SET_ITINERARY_TRIP_OBJECT,
  payload: {
    tripId
  }
})
