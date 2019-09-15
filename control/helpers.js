const { trips } = require('../models/config')
const todos = require('../models/todoSchema')
const order = require('../models/orderSchema')
const itinerarys = require('../models/itineararySchema')
const User = require('../models/user')
const moment = require('moment')
const uuidv1 = require('uuid/v1')
const postNewTrip = async (req, res) => {
  try {
    const Trip = {
      tripName: req.body.tripName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      admin: req.cookies.userId,
      member: []
    }
    const newTripData = await trips.create(Trip)
    res.status(201).json(`data added successfully${newTripData}`)
  } catch (error) {
    res.status(400).json(Object.create(error))
  }
}
const countTrip = async (req, res) => {
  try {
    res.status(200).json({ tripCount: 2 })
  } catch (error) {
    res.status(404).json(error)
  }
}
const tripsById = async (req, res) => {
  try {
    const _id = req.params.id
    const tripData = await trips.findById(_id)
    res.status(200).json(tripData)
  } catch (error) {
    res.status(404).json(error)
  }
}
const allTrip = async (req, res) => {
  try {
    const allTripsData = await trips.find()
    const allTripData = allTripsData.map(obj => {
      const trips = {}
      trips['tripName'] = obj.tripName
      trips['_id'] = obj._id
      trips['createdAt'] = obj.createdAt
      return trips
    })
    res.status(200).json({ allTripData })
  } catch (error) {
    res.status(404).json(error)
  }
}

const updateTrip = async (req, res) => {
  try {
    const updatedTripData = await trips.findOneAndUpdate({ _id: req.body.id },
      { tripName: req.body.tripName }, { new: true })
    res.status(200).json(updatedTripData)
  } catch (error) {
    res.status(404).json(error)
  }
}
const deleteTrip = async (req, res) => {
  try {
    const deletedTrip = await trips.findOneAndDelete({ _id: req.params.id })
    res.status(200).json(`item deleted ${deletedTrip.tripName}`)
  } catch (error) {
    res.status(404).json(error)
  }
}

const particularItinearayData = async (req, res) => {
  try {
    // const _id = req.params.id
    // const currentUser = req.cookies.userId
    // const trip = await trips.find(_id)
    // console.log(trips.admin)
    // console.log(currentUser === trip.admin)
    const id = req.params.id
    const itinerary1 = await itinerarys.find({ tripId: id })
    if (itinerary1.length === 0) {
      const _id = req.params.id
      const particularTrip = await trips.findById(_id)
      const start = moment(particularTrip.startDate)
      const end = moment(particularTrip.endDate)
      const difference = start.diff(end, 'days')
      const itidata = await itineraryLoop(start, Math.abs(difference), particularTrip._id)
      const itineraryData = await itinerarys.create(itidata)
      const itinerary = await itineraryData.map(item => {
        const itinerary = {}
        itinerary['day'] = item.day
        itinerary['_id'] = item._id
        itinerary['date'] = item.date
        itinerary['location'] = item.location
        itinerary['activity'] = item.activity
        return itinerary
      })
      res.status(200).json({ itinerary, isAdmin: true })
    } else {
      const result = await itinerarys.find({ tripId: id })
      const itinerary = await result.map(item => {
        const itinerary = {}
        itinerary['day'] = item.day
        itinerary['_id'] = item._id
        itinerary['date'] = item.date
        itinerary['location'] = item.location
        itinerary['activity'] = item.activity
        return itinerary
      })
      res.status(200).json({ itinerary, isAdmin: true })
    }
  } catch (error) {
    res.status(400).json(error)
  }
}
const itineraryLoop = (start, difference, id) => {
  const itineraryArray = []
  for (let i = 1; i <= (difference + 1); i++) {
    const Itinerary = {
      day: i,
      _id: uuidv1(),
      date: start.add(1, 'days').format('DD-MM-YYYY'),
      location: ' ',
      activity: [],
      tripId: id
    }
    itineraryArray.push(Itinerary)
  }
  return itineraryArray
}

const itineraryData = async (req, res) => {
  try {
    const dayId = req.body._id
    const itinerarayLocation = req.body.location
    const itinerarayActivity = req.body.activity
    const id = req.params.id
    const itinerary = await itinerarys.find({ tripId: id })
    for (const x of itinerary) {
      if (x.id === dayId) {
        const result = await itinerarys.findOneAndUpdate({ _id: x.id }, { activity: itinerarayActivity, location: itinerarayLocation })
      }
    }
    res.status(200).json({ msg: 'data updated' })
  } catch (error) {
    console.log(error)
    res.status(404).json(error)
  }
}

const getUser = async (req, res) => {
  // console.log(req.cookies.userId)
  if (req.cookies.userId !== undefined) {
    const currentUser = User.findById(req.cookies.userId)
    if (currentUser.length !== 0) { return res.status(200).json({ userName: currentUser.name }) }
  }
  res.status(401).json({ msg: 'user not found' })
}

// Todo logic
const getAllTodos = async (req, res) => {
  try {
    const userId = req.cookies.userId
    const todo = await todos.find({ user: userId })
    let column = await order.find({ user: userId })
    if (column.length === 0) { column = await createOrder(userId) }
    const columnOrders = await column.map(item => {
      const order = {}
      order['todo'] = item.todo
      order['inprogress'] = item.inprogress
      order['done'] = item.done
      return order
    })
    const columnOrderArray = await column.map(item => item.columnOrder)

    const todoFormat = await todo.map(item => {
      const todos = {}
      todos['_id'] = item._id
      todos['text'] = item.text
      todos['createdAt'] = item.createdAt
      return todos
    })
    res.status(200).json({ tasks: todoFormat, columns: { ...columnOrders[0] }, columnOrder: columnOrderArray[0] })
  } catch (error) {
    console.log(error)
    res.status(404).json(error)
  }
}

const createTodo = async (req, res) => {
  try {
    const userId = req.cookies.userId
    const Todo = {
      text: req.body.text,
      id: uuidv1(),
      user: userId
    }
    const newTodo = await todos.create(Todo)
    const todoData = { _id: newTodo._id, createdAt: newTodo.createdAt }
    const column = await order.find({ user: userId })
    const newTask = column[0].todo.taskIds
    newTask.push(newTodo.id)
    const result = await order.findOneAndUpdate({ _id: userId }, { todo: { taskIds: newTask } })
    // console.log(column[0].todo.taskIds)
    // order.update({ _id: userId }, { todo: { taskIds: newTask } })
    res.status(201).send({ ...todoData })
  } catch (error) {
    // console.log(error)
    res.status(400).json(error)
  }
}

async function createOrder (userId) {
  const columnsOrder = {
    todo: {
      taskIds: []
    },
    inprogress: {
      taskIds: []
    },
    done: {
      taskIds: []
    },
    columnOrder: ['todo', 'inprogress', 'done'],
    user: userId
  }
  const data = await order.create(columnsOrder)
  return data
}

const columnOrderData = async (req, res) => {
  try {
    const tripId = req.body.tripId
    const fromColumn = req.body.sourceColumnId
    const toColumn = req.body.destinationColumnId
    const fromIndex = req.body.sourceIndex
    const toIndex = req.body.destinationIndex
    const todoOrder = await order.find()
    const removedIndex = await todoOrder[0].fromColumn.taskIds.splice(fromIndex, 1)
    const newOrder = await todoOrder[0].toColumn.taskIds.splice(toIndex, 0, removedIndex)
  } catch (error) {
    res.status(404).json(error)
  }
}

const updateTodoTask = async (req, res) => {
  try {
    const _id = req.params.id
    const userId = req.cookies.userId
    // const todoData = await todos.findById({ user: _id })
    const updatedTodo = await todos.findOneAndUpdate({ user: _id }, { text: req.body.text })
    res.status(200).json({ msg: 'Data Updated' })
  } catch (error) {
    res.status(404).json(error)
  }
}

const deleteTask = async (req, res) => {
  try {
    // const user = await trips.findById(req.body.userId)
    const deleteTodo = await User.todo.findOneAndDelete({ id: req.body.taskId })
    res.status(200).json(`task Deleted ${deleteTodo.tripName}`)
  } catch (error) {
    res.status(404).json(error)
  }
}

module.exports = { postNewTrip, allTrip, tripsById, updateTrip, deleteTrip, particularItinearayData, createTodo, updateTodoTask, deleteTask, columnOrderData, countTrip, getUser, itineraryData, getAllTodos }
