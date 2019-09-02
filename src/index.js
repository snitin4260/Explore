import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import logger from 'redux-logger'
import Root from './root'
import './index.css'
const middlewares = [thunk, logger]
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducers, composeEnhancers(applyMiddleware(...middlewares)))

ReactDOM.render(<Root store={store} />, document.getElementById('root'))
