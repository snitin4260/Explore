import {
  SET_CHAT_OBJECT,
  GET_CHAT_MESSAGES_SUCCESS,
  GET_CHAT_MESSAGES_START,
  GET_CHAT_MESSAGES_FAIL,
  ADD_CHAT_MESSAGE
} from './actionConstants'

import { API_URL } from '../api/index'

export const setChatObject = tripId => ({
  type: SET_CHAT_OBJECT,
  payload: {
    tripId
  }
})

const getChatMessagesStart = tripId => ({
  type: GET_CHAT_MESSAGES_START,
  payload: {
    tripId
  }
})

export const addChatMessage = ({ tripId, message }) => {
  return {
    type: ADD_CHAT_MESSAGE,
    payload: {
      tripId,
      message
    }
  }
}

export const getChatMessages = tripId => async dispatch => {
  dispatch(getChatMessagesStart(tripId))
  try {
    const response = await fetch(`${API_URL}/chat/${tripId}`)
    const data = await response.json()
    if (response.status === 200) {
      dispatch({
        type: GET_CHAT_MESSAGES_SUCCESS,
        payload: {
          tripId,
          data: data.messages
        }
      })
    } else {
      dispatch({
        type: GET_CHAT_MESSAGES_FAIL,
        payload: {
          tripId,
          error: data.msg
        }
      })
    }
  } catch (e) {
    dispatch({
      type: GET_CHAT_MESSAGES_FAIL,
      payload: {
        tripId,
        error: 'Server is down. Please try after some time'
      }
    })
  }
}
