import produce from 'immer'
import {
  SET_TRIP_OBJECT
} from '../actions/actionConstants'

const tripDataReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_TRIP_OBJECT:
      if (state[action.payload.tripId]) {
        return state
      }
      return produce(state, draft => {
        draft[action.payload.tripId] = {
          tripId: action.payload.tripId,
          isAdmin: null
        }
      })

    default:
      return state
  }
}

export default tripDataReducer
