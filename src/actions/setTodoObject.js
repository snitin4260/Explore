import { SET_TRIP_TODO_OBJECT } from './actionConstants'

export default (tripId) => ({
  type: SET_TRIP_TODO_OBJECT,
  payload: {
    tripId
  }
})
