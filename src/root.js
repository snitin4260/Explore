import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import MainPage from './components/Mainpage/MainPage'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import Trips from './components/trips/Trips'
import CreateTrip from './components/trips/CreateTrip'
import AllTrip from './components/trips/AllTrip'
import ItineraryDisplay from './components/Itinerary/ItineraryDisplay'
import Todo from './components/Todo/TodoApp'

function Root ({ store }) {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path='/' exact component={MainPage} />
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
          <Route path='/trip' exact component={Trips} />
          <Route path='/trip/create' component={CreateTrip} />
          <Route path='/trip/all' component={AllTrip} />
          <Route path='/trip/itinerary/:id' component={ItineraryDisplay} />
          <Route path='/trip/todo/:id' component={Todo} />
        </Switch>
      </Router>
    </Provider>
  )
}

export default Root
