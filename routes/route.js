// import express from 'express'
const express = require('express')
const mail = require('../control/mail')
const { postNewTrip, allTrip, tripsById, updateTrip, deleteTrip, particularItinearayData, createTodo, updateTodoTask, deleteTask, columnOrderData, countTrip } = require('../control/helpers')
const { register } = require('../control/auth')
const router = express.Router()

router.post('/register', register)
router.get('/itinerary/:id', particularItinearayData)
router.get('/all', allTrip)
router.post('/sendMail', mail)
router.post('/new', postNewTrip)
router.put('/updatetrip', updateTrip)
router.get('/:id', tripsById)
router.delete('/delete/:id', deleteTrip)
router.post('/todo/create', createTodo)
router.put('/todo/update', updateTodoTask)
router.delete('/todo/deleteTask', deleteTask)
router.post('/todo/dnd', columnOrderData)
// router.get('/count', countTrip)

module.exports = router
