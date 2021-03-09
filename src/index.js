/*
入口js
 */
import React from 'react'
import ReactDOM from 'react-dom'

import App from './App.js'
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

const user = storageUtils.getUser()
memoryUtils.user = user

//将App组件标签渲染到index页面的div上
ReactDOM.render(<App />, document.getElementById('root'))