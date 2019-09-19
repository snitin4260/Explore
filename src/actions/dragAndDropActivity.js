import {
  DRAG_AND_DROP,
  RESET_TODO_STATE,
  RESET_DND_STATE,
  DND_ERROR,
  ALL_DRAG_DISABLED
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
      dispatch({
        type: ALL_DRAG_DISABLED,
        payload: {
          tripId
        }
      })

      dispatch({
        type: DND_ERROR,
        payload: {
          tripId
        }
      })
      setTimeout(() => {
        // this line is specifically for after an error and we are in process of resetting back to
        // prev state and drag and drop happens in between 2
        const arr = store.getState().dnd[tripId].data
        console.log(arr)
        const index = arr.findIndex(elem => {
          return elem.dndId === dndId
        })
        console.log(index)
        if (index == -1) return

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
      }, 2000)
    }
  }
}
