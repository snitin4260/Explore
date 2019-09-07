import {
  UPDATE_USERNAME,
  GET_USERNAME_START,
  GET_USERNAME_SUCCESS,
  GET_USERNAME_FAIL
} from '../actions/actionConstants'

const initialState = {
  userName: null,
  isFetchingData: false,
  fetchError: {
    status: null,
    error: null
  }
}

export default (state = initialState, action) => {
  if (action.type === UPDATE_USERNAME) {
    return {
      ...state,
      userName: action.payload.userName
    }
  }
  if (action.type === GET_USERNAME_START) {
    return {
      ...state,
      isFetchingData: true
    }
  }
  if (action.type === GET_USERNAME_SUCCESS) {
    return {
      ...state,
      isFetchingData: false,
      userName: action.payload.userName
    }
  }
  if (action.type === GET_USERNAME_FAIL) {
    return {
      ...state,
      isFetchingData: false,
      fetchError: {
        error: action.payload.msg,
        status: action.payload.status
      }

    }
  }

  return state
}
