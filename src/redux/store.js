/*
redux中最核心的管理对象store
 */
import {createStore, applyMiddleware} from 'redux'
import trunk from 'redux-thunk'

import reducer from './reducer'

export default createStore(reducer, applyMiddleware(trunk))