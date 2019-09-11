import { combineReducers } from 'redux'
import getTripCountReducer from './getTripCountReducer'
import getAllTripDataReducer from './getAllTripDataReducer'
import changeTripDataReducer from './changeTripDataReducer'
import changeItineraryDataReducer from './changeItineraryReducer'
import changeTodoDataReducer from './changeTodoDataReducer'
import userDataReducer from './userDataReducer'
import chatReducer from './chatReducer'

export default combineReducers({
  inititalTripCountDetail: getTripCountReducer,
  tripNamesData: getAllTripDataReducer,
  tripData: changeTripDataReducer,
  itinerary: changeItineraryDataReducer,
  todo: changeTodoDataReducer,
  user: userDataReducer,
  chat: chatReducer
})
