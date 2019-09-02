import { SET_TRIP_OBJECT } from './actionConstants'

export default (id) => ({
  type: SET_TRIP_OBJECT,
  payload: {
    tripId: id
  }
})
