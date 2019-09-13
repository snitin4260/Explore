import {
  UPDATE_USERNAME,
  GET_USERNAME_START,
  GET_USERNAME_SUCCESS,
  GET_USERNAME_FAIL,
  RESET_STATUS
} from './actionConstants'
import { API_URL } from '../api/index'

export const getUsername = _ => async dispatch => {
  dispatch({
    type: GET_USERNAME_START
  })
  try {
    const response = await fetch(`${API_URL}/user`)
    const responseObject = await response.json()
    if (response.status === 200) {
      localStorage.setItem(
        'user',
        JSON.stringify({
          userName: responseObject.userName
        })
      )
      dispatch({
        type: GET_USERNAME_SUCCESS,
        payload: {
          userName: responseObject.userName
        }
      })
    } else {
      dispatch({
        type: GET_USERNAME_FAIL,
        payload: {
          msg: responseObject.msg,
          status: response.status
        }
      })
    }
  } catch (e) {
    dispatch({
      type: GET_USERNAME_FAIL,
      payload: {
        msg: 'Server is down. Please try after some time',
        status: null
      }
    })
  }
}



export const updateUsername = userName => ({
  type: UPDATE_USERNAME,
  payload: {
    userName
  }
})
