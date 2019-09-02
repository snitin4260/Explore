import {
  GET_TRIPS_COUNT_START,
  GET_TRIPS_COUNT_SUCCESS,
  GET_TRIPS_COUNT_FAIL
} from '../actions/actionConstants'

const initialTripCountState = {
  tripCount: null,
  error: null,
  isLoading: false
}

const getTripCountReducer = (state = initialTripCountState, action) => {
  switch (action.type) {
    case GET_TRIPS_COUNT_START:
      return {
        ...state,
        isLoading: true
      }

    case GET_TRIPS_COUNT_SUCCESS:
      return {
        ...state,
        tripCount: action.payload.tripCount,
        isLoading: false
      }

    case GET_TRIPS_COUNT_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      }

    default:
      return state
  }
}

export default getTripCountReducer
