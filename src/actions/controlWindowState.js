import { SHOW_SLIDER, HIDE_SLIDER, SHOW_EDIT_WINDOW, HIDE_EDIT_WINDOW } from './actionConstants'

export const showSlider = ({ tripId, todoItemId }) => {
  return {
    type: SHOW_SLIDER,
    payload: {
      tripId,
      todoItemId
    }
  }
}

export const showEditWindow = ({ tripId, todoItemId }) => {
  return {
    type: SHOW_EDIT_WINDOW,
    payload: {
      tripId,
      todoItemId
    }
  }
}
export const hideEditWindow = ({ tripId }) => {
  return {
    type: HIDE_EDIT_WINDOW,
    payload: {
      tripId
    }
  }
}

export const hideSlider = ({ tripId }) => {
  return {
    type: HIDE_SLIDER,
    payload: {
      tripId

    }
  }
}
