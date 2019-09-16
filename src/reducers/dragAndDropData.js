import produce from 'immer'

import {
  ADD_DRAG_AND_DROP_DATA,
  RESET_DND_STATE,
  SET_DRAG_AND_DROP_DATA_OBJECT
} from '../actions/actionConstants'

export default (state = {}, action) => {
  switch (action.type) {
    case ADD_DRAG_AND_DROP_DATA: {
      return produce(state, draft => {
        const dndObject = draft[action.payload.id]
        dndObject.data.push(action.payload.data)
      })
    }

    case SET_DRAG_AND_DROP_DATA_OBJECT: {
      return produce(state, draft => {
        draft[action.payload.id] = {
          data: []
        }
      })
    }

    case RESET_DND_STATE: {
      return produce(state, draft => {
        const { id, data } = action.payload
        draft[action.payload.id] = {
          data: [data]
        }
      })
    }

    default:
      return state
  }
}
