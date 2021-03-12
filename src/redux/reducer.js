/*
根据之前的state和指定的action生成并返回新的state
 */
import {combineReducers} from 'redux'

import {SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER} from './action-types'
import storageUtils from "../utils/storageUtils";

//  用来管理头部标题的reducer函数
const initHeadTitle = ''
function headTitle(state=initHeadTitle, action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}

//  用来管理当前登陆用户的reducer函数
const initUser = storageUtils.getUser()
function user(state=initUser, action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.user
        case SHOW_ERROR_MSG:
            const errorMsg = action.errorMsg
            return {...state, errorMsg}
        case RESET_USER:
            return {}
        default:
            return state
    }
}

export default combineReducers({
    headTitle,
    user
})