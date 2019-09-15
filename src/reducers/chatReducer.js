import produce from 'immer'
import {
  SET_CHAT_OBJECT,
  GET_CHAT_MESSAGES_START,
  GET_CHAT_MESSAGES_SUCCESS,
  GET_CHAT_MESSAGES_FAIL,
  ADD_CHAT_MESSAGE
} from '../actions/actionConstants'

export default (state = {}, action) => {
  switch (action.type) {
    case SET_CHAT_OBJECT: {
      return produce(state, draft => {
        draft[action.payload.tripId] = {
          error: null,
          isLoading: true,
          data: []
        }
      })
    }

    case GET_CHAT_MESSAGES_START: {
      return produce(state, draft => {
        const chatObj = draft[action.payload.tripId]
        chatObj.isLoading = true
      })
    }

    case GET_CHAT_MESSAGES_SUCCESS: {
      return produce(state, draft => {
        const chatObj = draft[action.payload.tripId]
        chatObj.isLoading = false
        chatObj.data = action.payload.data
      })
    }

    case GET_CHAT_MESSAGES_FAIL: {
      return produce(state, draft => {
        const chatObj = draft[action.payload.tripId]
        chatObj.isLoading = false
        chatObj.error = action.payload.error
      })
    }

    case ADD_CHAT_MESSAGE: {
      return produce(state, draft => {
        const chatObj = draft[action.payload.tripId]
        chatObj.data.push(action.payload.message)
      })
    }

    default:
      return state
  }
}
