// const { trips } = require('../models/config')
const todos = require('../models/todoSchema')
const order = require('../models/orderSchema')
const itinerarys = require('../models/itineararySchema')
const invite = require('../models/inviteSchema')
const User = require('../models/user')
const moment = require('moment')
const client = require('../models/postgres')
const uuidv1 = require('uuid/v1')
const invitePeoples = require('./mail')
// const postNewTrip = async (req, res) => {
//   try {
//     const admin = req.session._id
//     const Trip = {
//       tripName: req.body.tripName,
//       startDate: req.body.startDate,
//       endDate: req.body.endDate,
//       admin: admin,
//       members: []
//     }
//     await Trip['members'].push(admin)
//     const newTripData = await trips.create(Trip)
//     res.status(201).json(`data added successfully${newTripData}`)
//   } catch (error) {
//     res.status(400).json(Object.create(error))
//   }
// }

const postNewTrip = async (req, res) => {
  try {
    // const _id = uuidv1()
    const admin = req.session._id
    const { tripName, startDate, endDate } = req.body
    const result = await client.query('INSERT INTO tripsTable (tripName, startDate, endDate, admin, members) VALUES ($1,$2,$3,$4,ARRAY[$5])',
      [tripName, startDate, endDate, admin, admin])
    res.status(201).json(result)
  } catch (err) {
    console.log(err)
    res.status(400).json({ msg: 'Problem Saving in Data' })
  }
}
const countTrip = async (req, res) => {
  try {
    const tripId = req.params.id
    const count = await client.query(' SELECT members FROM trip WHERE _id = $1 ) VALUES ($1)', [tripId])
    console.log('++' + count)
    res.status(200).json({ tripCount: count.rows[0].length })
  } catch (err) {
    res.status(404).json({ msg: 'No data found' })
  }
}

const allTrip = async (req, res) => {
  try {
    const userId = req.session._id
    const allTrips = await client.query('SELECT tripName,_id,createdAt FROM tripsTable  WHERE admin = $1', [userId])
    const allTripData = allTrips.rows.map(obj => {
      const trips = {}
      trips['tripName'] = obj.tripname
      trips['_id'] = obj._id
      trips['createdAt'] = obj.createdat
      return trips
    })
    res.status(200).json({ allTripData })
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'No Trips found' })
  }
}

// const itineraryData = async (req, res) => {
//   try {
//     const dayId = req.body._id
//     const itinerarayLocation = req.body.location
//     const itinerarayActivity = req.body.activity
//     const id = req.params.id
//     const itinerary = await itinerarys.find({ tripId: id })
//     for (const x of itinerary) {
//       if (x.id === dayId) {
//         const result = await itinerarys.findOneAndUpdate({ _id: x.id }, { activity: itinerarayActivity, location: itinerarayLocation })
//       }
//     }
//     res.status(200).json({ msg: 'data updated' })
//   } catch (error) {
//     console.log(error)
//     res.status(404).json(error)
//   }
// }

const itineraryData = async (req, res) => {
  try {
    const dayId = req.body._id
    const itinerarayLocation = req.body.location
    const itinerarayActivity = req.body.activity
    const tripId = req.params.id
    // const all = itinerarayActivity.map(item => {
    //   const itinerary = client.query('INSERT INTO  activity (_id, task, dayId,tripId) WHERE tripId = $6 AND dayId = $7  VALUES ($1,$2,$3,$4) ON CONFLICT ON CONSTRAINT activity_task_key DO NOTHING',
    //     [item.itinerarayActivity['id'], item.itinerarayActivity.task, item.dayId, item.tripId, item.dayId, item.tripId])
    //   const locationUpdate = client.query('UPDATE itinerary SET location =$1 WHERE dayId = $2 ON CONFLICT ON CONSTRAINT activity_location_key DO NOTHING',
    //     [item.itinerarayLocation, item.dayId])
    // })
    res.status(200).json({ msg: 'data updated' })
  } catch (err) {
    console.log(err)
    res.status(404).json(err)
  }
}

const particularItinearayData = async (req, res) => {
  try {
    console.log('im done')
    const itineraryData = await client.query('SELECT * FROM itinerary WHERE tripId =$1', [req.params.id])
    // console.log(itineraryData)
    if (itineraryData.rows.length === 0) {
      const particularTrip = await client.query('SELECT startdate, enddate, _id FROM tripsTable WHERE _id = $1', [req.params.id])
      console.log(particularTrip['rows'][0].startdate)
      const start = moment(particularTrip['rows'][0].startdate)
      const end = moment(particularTrip['rows'][0].enddate)
      const difference = end.diff(start, 'days')
      const itineraryCreate = await itineraryLoop(start, difference, particularTrip['rows'][0]._id)
      const allIti = await client.query('SELECT * FROM itinerary WHERE tripId =$1', [req.params.id])
      let activity = await client.query('SELECT * FROM activity WHERE tripId =$1', [req.params.id])
      activity = activity.rows.length === 0 ? [] : [...activity.rows]
      const itinerary = await allIti['rows'].map(item => {
        const itinerary = {}
        itinerary['day'] = item.day
        itinerary['_id'] = item._id
        itinerary['date'] = item.date
        itinerary['activity'] = activity
        itinerary['location'] = item.location
        return itinerary
      })
      res.status(200).json({ itinerary, isAdmin: true })
    } else {
      let activity = await client.query('SELECT * FROM activity WHERE tripId =$1', [req.params.id])
      activity = activity.rows.length === 0 ? [] : [...activity.rows]
      const itinerary = await itineraryData['rows'].map(item => {
        const itinerary = {}
        itinerary['day'] = item.day
        itinerary['_id'] = item._id
        itinerary['date'] = item.date
        itinerary['location'] = item.location
        itinerary['activity'] = activity
        return itinerary
      })
      res.status(200).json({ itinerary, isAdmin: true })
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ msg: 'something went wrong' })
  }
}
const itineraryLoop = (start, difference, id) => {
  for (let i = 1; i <= (difference + 1); i++) {
    const data = client.query('INSERT INTO itinerary (day, _id, date, location, tripid) VALUES ($1,$2,$3,$4,$5)', [i, uuidv1(),
      start.add(1, 'days').format('DD-MM-YYYY'), '', id])
  }
}

const getAllMembers = async (req, res) => {
  console.log('im done')
  try {
    const _id = req.params.id
    const tripData = await trips.findById(_id)
    const memberList = tripData['members']
    const list = []
    for (const id of memberList) {
      const user = await User.findById(id)
      list.push(user)
    }
    const members = await list.map(obj => {
      const memList = {}
      memList['_id'] = obj._id
      memList['name'] = obj.name
      memList['email'] = obj.email
      return memList
    })
    res.status(200).json({ data: members })
  } catch (error) {
    console.log(error)
    res.status(404).json(error)
  }
}

const getUser = async (req, res) => {
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
    const tripId = req.params.id
    const Todo = {
      text: req.body.text,
      id: uuidv1(),
      trip: tripId,
      user: req.session._id
    }
    const newTodo = await todos.create(Todo)
    const todoData = { _id: newTodo._id, createdAt: newTodo.createdAt }
    const column = await order.find({ trip: req.params.id, user: req.session._id })
    const newTask = await column[0].todo.taskIds
    const newList = await newTask.push(newTodo.id)
    // const result = await order.findOneAndUpdate({ todo: { taskIds: newTask } })
    const result = await order.findOneAndUpdate({ trip: req.params.id, user: req.session._id },
      { todo: { taskIds: newTask } })
    // console.log(result[0].todo.taskIds)
    res.status(201).send({ ...todoData })
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

async function createOrder (tripId, user) {
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

const invitePeople = async (req, res) => {
  const trip = req.params.id
  const userEmail = req.body.email[0].text
  try {
    const secureInvite = { tripId: trip, token: uuidv1(), email: userEmail }
    const inv = await invite.create(secureInvite)
    await invitePeoples(trip, userEmail, inv.token)
    res.status(200).send({ msg: 'Email Sent Succesfully' })
  } catch (error) {
    res.status(400).send({ msg: 'Something Went Wrog' })
  }
}

const joinTrip = async (req, res) => {
  const trip = req.params.id
  const email = req.body.email
  try {
    const tripData = await trips.findOne({ _id: trip })
    const admin = await User.findOne({ _id: tripData.admin })
    const userAlreadyExist = await User.findOne({ email: email })
    const existInTrip = tripData['members'].indexOf(userAlreadyExist._id)
    if (userAlreadyExist && existInTrip === -1) {
      return res.status(200).send({ hasAccount: true, userName: admin.name })
    } else {
      res.status(200).send({ hasAccount: false, userName: admin.name })
    }
  } catch (error) {
    console.log(error)
  }
}

const joinAdd = async (req, res) => {
  try {
    const trip = req.params.id
    const email = req.body.email
    const key = req.body.key
    const tripData = await trips.findOne({ _id: trip })
    const tokenData = await invite.find({ email: email })
    console.log(tokenData)
    const userVerfied = tokenData.filter(item => item.token === key)
    if (userVerfied.length !== 0) {
      const user = await User.findOne({ email: email })
      const newMember = tripData['members']
      newMember.push(user._id)
      const result = await trips.findOneAndUpdate({ _id: trip }, { members: newMember })
      console.log('+++' + result)
      res.status(200).send({ msg: 'User added To the trip' })
    }
    return res.status(403).send({ msg: 'Unknown User' })
  } catch (error) {
    console.log(error)
    res.status(400).send({ msg: 'something went wrong' })
  }
}

module.exports = {
  postNewTrip,
  countTrip,
  allTrip,
  particularItinearayData,
  createTodo,
  updateTodoTask,
  deleteTask,
  columnOrderData,
  getUser,
  itineraryData,
  getAllMembers,
  invitePeople,
  joinTrip,
  joinAdd,
  getAllTodos
}
