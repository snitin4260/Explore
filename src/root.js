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
import ItineraryEdit from './components/Itinerary/ItineraryEditContainer'
import Todo from './components/Todo/TodoApp'
import Chat from './components/Chat/Chat'
import JoinTrip from './components/trips/JoinTrip'
import Profile from './components/Profile/Profile'
import NoMatch from './components/NoMatch'
import PrivateRoute from './components/PrivateRoute'

function Root ({ store }) {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact component={MainPage} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/trip" exact component={Trips} />
          <PrivateRoute path="/trip/create" component={CreateTrip} />
          <PrivateRoute path="/trip/all" component={AllTrip} />
          <PrivateRoute path="/trip/itinerary/edit/:id" component={ItineraryEdit} />
          <PrivateRoute path="/trip/itinerary/:id" component={ItineraryDisplay} />
          <PrivateRoute path="/trip/todo/:id" component={Todo} />
          <PrivateRoute path="/trip/chat/:id" component={Chat} />
          <PrivateRoute path="/join/:id" component={JoinTrip} />
          <PrivateRoute path="/profile" component={Profile} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default Root
