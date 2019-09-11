const { trips } = require('../models/config')
const todos = require('../models/todoSchema')
const order = require('../models/orderSchema')
const itinerarys = require('../models/itineararySchema')
const User = require('../models/user')
const passport = require('passport')
const moment = require('moment')
const uuidv1 = require('uuid/v1')
const mongoose = require('mongoose')

const postNewTrip = async (req, res) => {
  try {
    // const start = moment(req.body.startDate)
    // const end = moment(req.body.endDate)
    // difference = (moment.duration(start.diff(end)).asDays())
    // difference = start.diff(end, 'days')
    const Trip = {
      tripName: req.body.tripName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      // itinerary: [],
      admin: req.cookies.userId,
      member: []
    }
    // const startDate = start
    // const newIti = await createItinerary(Math.abs(difference), startDate)
    // Trip.itinerary.push(newIti)
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
  console.log(req.user)
  try {
    const allTripsData = await trips.find()
    // console.log(allTripsData)
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

// const createItinerary = (difference, startDate) => {
//   const itineraryArray = []
//   for (let i = 1; i <= (difference + 1); i++) {
//     const Itinerary = {
//       day: i,
//       _id: uuidv1(),
//       date: startDate.add(1, 'days').format('DD-MM-YYYY'),
//       location: '',
//       activity: []
//     }
//     itineraryArray.push(Itinerary)
//   }
//   return itineraryArray
// }

const particularItinearayData = async (req, res) => {
  try {
    const id = req.params.id
    const itinerary1 = await itinerarys.find({ tripId: id })
    if (itinerary1.length === 0) {
      console.log('im in')
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
      res.status(201).json({ itinerary })
    } else {
      const result = await itinerarys.find({ tripId: id })
      // console.log('++' + result)
      const itinerary = await result.map(item => {
        const itinerary = {}
        itinerary['day'] = item.day
        itinerary['_id'] = item._id
        itinerary['date'] = item.date
        itinerary['location'] = item.location
        itinerary['activity'] = item.activity
        return itinerary
      })
      res.status(201).json({ itinerary })
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
    const iLocation = req.body.location
    const iActivity = req.body.activity
    // console.log(req.body)
    const id = req.params.id
    const itinerary = await itinerarys.find({ tripId: id })
    // console.log(itinerary)
    for (const x of itinerary) {
      // console.log(x.id)
      // console.log(dayId)
      console.log(iLocation)
      console.log(iActivity)

      // console.log(x.id === dayId)
      if (x.id === dayId) {
        // const query = { _id: x.id }
        const re = await itinerarys.findOneAndUpdate({ _id: x.id }, { activity: iActivity, location: iLocation })
        console.log(re)
      }
      // const itinerary22 = await itinerarys.find({ tripId: id })
    }
    res.status(200).json({ msg: 'data updated' })
  } catch (error) {
    console.log(error)
    res.status(404).json(error)
  }
}

// const itineraryData = async (req, res) => {
//   // console.log(req.body)
//   try {
//     const _id = req.params.id
//     const tripData = await trips.findById(_id)
//     // console.log(tripData.itinerary)
//     const itinerary = tripData.itinerary[0]
//     // console.log(itinerary)
//     for (const _id of itinerary) {
//       if (_id === req.body._id) {
//         itinerary.activity = req.body.activity
//         tripData.location = req.body.location
//       }
//     }
//     res.status(200).json({ msg: 'data updated' })
//   } catch (error) {
//     // console.log(error)
//     res.status(400).json(error)
//   }
// }
// const itineraryLocationUpdate = (id, data) => {
//   trips.findById(id, (err, trips) => {
//     if (err) return err
//   })
// }

// const itineraryLocationUpdate = async (req, res) => {
//   try {
//     const updatedLocationData = await trips.itinearary.findOneAndUpdate({ _id: req.body.id },
//       { location: req.body.location }, { new: true })
//     res.status(200).json(updatedLocationData)
//   } catch (error) {
//     res.status(404).json(error)
//   }
// }

// const itineraryActivityUpdate = async (req, res) => {
//   try {
//     const neraryActivityUpdate = await trips.itinearary.findOneAndUpdate({ _id: req.body.id },
//       { activity: req.body.activity }, { new: true })
//     res.status(200).json(neraryActivityUpdate)
//   } catch (error) {
//     res.status(404).json(error)
//   }
// }
// const itineraryActivityDelete = async (req, res) => {
//   try {
//     const activityDel = await trips.itinearary.findOneAndDelete({ _id: req.params.id })
//     res.status(200).json(`item deleted ${activityDel}`)
//   } catch (error) {
//     res.status(404).json(error)
//   }
// }

const getUser = async (req, res) => {
  const currentUser = User.findById(req.cookies.userId)
  if (currentUser) { return res.status(200).json({ userName: currentUser.name }) }
  res.status(401).json({ msg: 'user not found' })
}

// Todo logic

const getAllTodos = async (req, res) => {

}

const createTodo = async (req, res) => {
  try {
    const Todo = {
      text: req.body.text,
      id: uuidv1()
    }
    const newTodo = await todos.create(Todo)
    const todoData = { _id: newTodo.id, createdAt: newTodo.createdAt }
    let column = await order.find()
    if (column === undefined) { column = createOrder() }
    column[0].todo.taskIds.push(newTodo.id)
    res.status(201).send(todoData)
  } catch (error) {
    res.status(400).json(error)
  }
}

function createOrder () {
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
    columnOrder: []
  }
  const data = order.create(columnsOrder)
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
    // const userId = req.body.userId
    // const user = await todo.findById(userId)
    const updatedTodo = await User.todo.findOneAndUpdate({ id: req.body.taskId },
      { text: req.body.text }, { new: true })
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

module.exports = { postNewTrip, allTrip, tripsById, updateTrip, deleteTrip, particularItinearayData, createTodo, updateTodoTask, deleteTask, columnOrderData, countTrip, getUser, itineraryData }
