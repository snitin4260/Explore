import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Loader } from './Modal'
import styled from 'styled-components'

const List = styled.div`
  flex: 0 0 30rem;
  margin-left: 1rem;
  background-color: var(--todo-list-background);
  border-radius: 0.5rem;
  padding: 1rem;
  &:last-of-type {
    margin-right: 1rem;
  }
`;

const CardLoader = styled(Loader)`
  position: absolute;
  margin-top: -10px;
`

const CardTitile = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  background-color: var(--todo-list-background);
  font-family: "Roboto", sans-serif;
  color: #333;
  margin-bottom: 1rem;
  padding: 0 10px;
  line-height: 3.6rem;
`;
// overflow y should be applied here
const CardsContainer = styled.ul`
  list-style-type: none;
  background-color: var(--todo-list-background);
  color: #333;
  padding: 0 10px;
  min-height: 5rem;
`;

const Card = styled.li`
  background-color: #fff;
  padding: 10px;
  margin-bottom: 1rem;
  border-radius: 3px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  font-family: "Roboto", sans-serif;
  font-size: 1.5rem;
  max-width: 280px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  &:last-of-type {
    margin-bottom: 2rem;
  }
`
const TaskName = styled.div`
  overflow-wrap: break-word;
  max-width: 20rem;
  padding: 0.12rem;
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: cenetr;
`

function Column (props) {
  const {
    column,
    showSlider,
    showEditWindow,
    tasks,
    tripId,
    deleteTodoItem,
    deleteItemState
  } = props
  console.log(props)
  console.log(column.id)
  return (
    <List className='list'>
      <CardTitile>{column.title}</CardTitile>
      <Droppable droppableId={column.id}>
        {provided => {
          return (
            <CardsContainer
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tasks.map((taskObj, index) => {
                return (
                  <Draggable
                    key={taskObj.id}
                    draggableId={taskObj.id}
                    index={index}
                  >
                    {provided => {
                      return (
                        <Card
                          className='card'
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <TaskName>{taskObj.text}</TaskName>
                          {deleteItemState.isLoading &&
                            deleteItemState.todoItemId === taskObj.id && (
                            <CardLoader />
                          )}

                          <ButtonContainer>
                            <div
                              onClick={() => {
                                showEditWindow({
                                  tripId,
                                  todoItemId: taskObj.id
                                })
                              }}
                              id='edit'
                              style={{ cursor: 'pointer' }}
                            >
                              <svg
                                style={{
                                  width: '2rem',
                                  height: '2rem',
                                  color: 'rgba(63, 195, 128, 1)',
                                  marginRight: '1rem'
                                }}
                                role='img'
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 576 512'
                              >
                                <path
                                  fill='currentColor'
                                  d='M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z'
                                />
                              </svg>
                            </div>
                            <div
                              onClick={() => {
                                deleteTodoItem({
                                  tripId,
                                  columnId: column.id,
                                  todoItemId: taskObj.id
                                })
                              }}
                              id='delete'
                              style={{ cursor: 'pointer' }}
                            >
                              <svg
                                style={{
                                  width: '2rem',
                                  height: '2rem',
                                  color: 'rgba(240, 52, 52, 0.9)'
                                }}
                                role='img'
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 448 512'
                              >
                                <path
                                  fill='currentColor'
                                  d='M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z'
                                />
                              </svg>
                            </div>
                          </ButtonContainer>
                        </Card>
                      )
                    }}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </CardsContainer>
          )
        }}
      </Droppable>
    </List>
  )
}

export default Column
