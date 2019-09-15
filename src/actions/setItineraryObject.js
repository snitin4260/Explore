import {
  SET_ITINERARY_TRIP_OBJECT,
  EDIT_ITINERARY_DATA
} from './actionConstants'

export default tripId => ({
  type: SET_ITINERARY_TRIP_OBJECT,
  payload: {
    tripId
  }
})

export const changeItinerary = ({ tripId, _id, activity, location }) => ({
  type: EDIT_ITINERARY_DATA,
  payload: {
    tripId,
    _id,
    activity,
    location
  }
})
