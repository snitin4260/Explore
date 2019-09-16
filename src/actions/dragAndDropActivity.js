import {
  DRAG_AND_DROP,
  RESET_TODO_STATE,
  RESET_DND_STATE
} from './actionConstants'
import { API_URL } from '../api/index'

import { store } from '../index'

export default ({ tripId, source, destination, draggableId, dndId }) => ({
  type: DRAG_AND_DROP,
  payload: {
    tripId,
    source,
    destination,
    draggableId,
    dndId
  }
})

export const dragAndDropDataSend = ({
  tripId,
  source,
  destination,
  draggableId,
  dndId
}) => {
  return async dispatch => {
    const response = await fetch(`${API_URL}/todo/dnd/${tripId}`, {
      method: 'POST',
      body: JSON.stringify({
        tripId,
        sourceColumnId: source.droppableId,
        destinationColumnId: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
        taskId: draggableId
      })
    })
    if (response.status !== 200) {
      // rollback to prev state
      //  go to previous dndId
      // we have the current dndId here
      const arr = store.getState().dnd[tripId].data
      console.log(arr)
      const index = arr.findIndex(elem => {
        return elem.dndId === dndId
      })
      console.log(index)
      // reset back to index-1
      const todoState = store.getState().dnd[tripId].data[index - 1]
      console.log(todoState)
      dispatch({
        type: RESET_TODO_STATE,
        payload: {
          data: todoState,
          tripId
        }
      })
      dispatch({
        type: RESET_DND_STATE,
        payload: {
          data: todoState,
          id: tripId
        }
      })
    }
  }
}
