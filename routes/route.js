// import express from 'express'
const express = require('express')
const mail = require('../control/mail')
const { postNewTrip, allTrip, tripsById, updateTrip, deleteTrip, particularItinearayData, createTodo, updateTodoTask, deleteTask, columnOrderData, countTrip, getUser, itineraryData } = require('../control/helpers')
const { register } = require('../control/auth')
const router = express.Router()

router.post('/register', register)
router.get('/itinerary/:id', particularItinearayData)
router.post('/itinerary/edit/:id', itineraryData)
router.get('/trip/all', allTrip)
router.post('/sendMail', mail)
router.post('/trip/new', postNewTrip)
router.put('/trip/updatetrip', updateTrip)
router.get('/trip/:id', tripsById)
router.delete('/trip/delete/:id', deleteTrip)
router.post('/todo/create/:tripId', createTodo)
router.put('/todo/edit/:tripId', updateTodoTask)
router.delete('/todo/delete/:tripId', deleteTask)
router.post('/todo/dnd', columnOrderData)
router.get('/user', getUser)

// router.get('/count', countTrip)

module.exports = router
