import {
  GET_ALL_TRIP_DATA_START,
  GET_ALL_TRIP_DATA_SUCCESS,
  GET_ALL_TRIP_DATA_FAIL
} from '../actions/actionConstants'

const tripsData = {
  trips: null,
  error: null,
  isLoading: true
}

export default (state = tripsData, action) => {
  switch (action.type) {
    case GET_ALL_TRIP_DATA_START:
      return {
        ...state,
        isLoading: true
      }
    case GET_ALL_TRIP_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        trips: action.payload.trips

      }
    case GET_ALL_TRIP_DATA_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error

      }

    default:
      return state
  }
}
