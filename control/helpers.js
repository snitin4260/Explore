const { trips } = require('../models/config')
const todos = require('../models/todoSchema')
const order = require('../models/orderSchema')
const itinerarys = require('../models/itineararySchema')
const User = require('../models/user')
const moment = require('moment')
const uuidv1 = require('uuid/v1')
const postNewTrip = async (req, res) => {
  try {
    const admin = req.session._id
    // console.log(req.session.userId)
    const Trip = {
      tripName: req.body.tripName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      admin: admin,
      member: []
    }
    const newTripData = await trips.create(Trip)
    res.status(201).json(`data added successfully${newTripData}`)
  } catch (error) {
    res.status(400).json(Object.create(error))
  }
}
const countTrip = async (req, res) => {
  console.log('im hiting')
  try {
    const count = 0
    const _id = req.session._id
    const totalTrips = await trips.find({ admin: _id })
    const total = await totalTrips.filter(item => item._id === _id)
    res.status(200).json({ tripCount: totalTrips.length })
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
    const _id = req.session._id
    const allTripsData = await trips.find({ admin: _id })
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
    console.log(req.session.user)
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
      location: '',
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
const getAllMembers = async (req, res) => {
  console.log('im done')
  try {
    const _id = req.params.id
    const tripData = await trips.findById(_id)
    const members = await tripData.map(item => item.member)
    res.status(200).json({ member: members })
  } catch (error) {
    res.status(404).json(error)
  }
}

const getUser = async (req, res) => {
  // console.log('+' + req.cookies.userId)
  // console.log('im in')
  if (req.session._id !== undefined) {
    const currentUser = await User.findById(req.session._id)
    if (currentUser.length !== 0) {
      return res.status(200).json({ userName: currentUser.name })
    }
  }
  res.status(401).json({ msg: 'user not found' })
}

// Todo logic
const getAllTodos = async (req, res) => {
  try {
    const user = req.session._id
    const tripId = req.params.id
    const todo = await todos.find({ trip: tripId, user: req.session._id })
    let column = await order.find({ trip: tripId, user: req.session._id })
    if (column.length === 0) { column = await createOrder(tripId, user) }
    const columnOrders = column.map(item => {
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
    const tripId = req.params.id
    const Todo = {
      text: req.body.text,
      id: uuidv1(),
      trip: tripId,
      user: req.session._id
    }
    const newTodo = await todos.create(Todo)
    console.log(newTodo)
    const todoData = { _id: newTodo._id, createdAt: newTodo.createdAt }
    const column = await order.find({ trip: req.params.id, user: req.session._id })
    // console.log(column)
    const newTask = column[0].todo.taskIds
    newTask.push(newTodo.id)
    const result = await order.findOneAndUpdate({ todo: { taskIds: newTask } })
    res.status(201).send({ ...todoData })
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

async function createOrder (tripId, user) {
  console.log('888' + tripId)
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
    user: user,
    trip: tripId
  }
  const data = await order.create(columnsOrder)
  return data
}

const columnOrderData = async (req, res) => {
  try {
    const tripId = req.params.id
    console.log(req.body)
    const fromColumn = req.body.sourceColumnId
    const toColumn = req.body.destinationColumnId
    const fromIndex = req.body.sourceIndex
    const toIndex = req.body.destinationIndex
    const todoOrder = await order.find({ trip: tripId, user: req.session._id })
    const fromArray = todoOrder[0][`${fromColumn}`].taskIds
    const fromId = fromArray.splice(fromIndex, 1)
    const result = await order.findOneAndUpdate({ [`${fromColumn}`]: { taskIds: fromArray } })
    const toId = todoOrder[0][`${toColumn}`].taskIds
    toId.splice(toIndex, 0, fromId)
    const newOrderData = await order.findOneAndUpdate({ [`${toColumn}`]: { taskIds: toId } })
    res.status(200).end()
  } catch (error) {
    console.log(error)
    res.status(404).json(error)
  }
}

const updateTodoTask = async (req, res) => {
  try {
    // const todo = await todos.find()
    // console.log(todo)
    const updatedTodo = await todos.findOneAndUpdate({ _id: req.body.taskId }, { text: req.body.text })
    console.log(updatedTodo)
    res.status(200).json({ msg: 'Data Updated' })
  } catch (error) {
    console.log(error)
    res.status(404).json(error)
  }
}

const deleteTask = async (req, res) => {
  try {
    const column = req.body.columnId
    const orders = await order.find()
    const deleteItem = orders[0][`${column}`].taskIds
    const index = deleteItem.indexOf(req.body.taskId)
    const updatedArray = deleteItem.splice(index, 1)
    const deleteTodo = await order.findOneAndUpdate({ [`${column}`]: { taskIds: deleteItem } })
    res.status(200).json(`task Deleted ${deleteTodo}`)
  } catch (error) {
    console.log(error)
    res.status(404).json(error)
  }
}
module.exports = { postNewTrip,
  allTrip,
  tripsById,
  updateTrip,
  deleteTrip,
  particularItinearayData,
  createTodo,
  updateTodoTask,
  deleteTask,
  columnOrderData,
  countTrip,
  getUser,
  itineraryData,
  getAllMembers,
  getAllTodos }
