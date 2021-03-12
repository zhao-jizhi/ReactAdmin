/*
入口js
 */
import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import store from './redux/store'

//将App组件标签渲染到index页面的div上
ReactDOM.render(<App store={store} />, document.getElementById('root'))

store.subscribe(() => {
    ReactDOM.render(<App store={store} />, document.getElementById('root'))
})