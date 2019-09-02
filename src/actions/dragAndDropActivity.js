import { DRAG_AND_DROP } from './actionConstants'
import { API_URL } from '../api/index'

export default ({ tripId, source, destination, draggableId }) => ({
  type: DRAG_AND_DROP,
  payload: {
    tripId,
    source,
    destination,
    draggableId
  }
})

export const dragAndDropDataSend = ({
  tripId,
  source,
  destination,
  draggableId
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
    }
  }
}
