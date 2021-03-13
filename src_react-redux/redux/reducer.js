import {combineReducers} from 'redux'

import {INCREMENT, DECREMENT} from './action-types'

function count (state=0, action) {
    switch (action.type) {
        case INCREMENT:
            return state + action.data
        case DECREMENT:
            return state - action.data
        default:
            return state
    }
}
const initUser = {}
function user(state=initUser, action) {
    switch (action.type) {
        default:
            return state
    }
}

export default combineReducers({
    count,
    user
})