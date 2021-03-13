/*
容器组件: 通过connect包装UI组件产生组件
connect(): 高阶函数
connect()返回的函数是一个高阶组件: 接收一个UI组件, 生成一个容器组件
容器组件的责任: 向UI组件传入特定的属性
 */
import React,{Component} from 'react'
import {connect} from 'react-redux'

import Counter from '../components/Counter'
import {increment, decrement, incrementAsync} from '../redux/actions'

/*
function mapStateToProps(state) {
    return {
        count: state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        increment: (number) => dispatch(increment(number)),
        decrement: (number) => dispatch(decrement(number))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter)*/

export default connect(
    state => ({count :state.count}),
    {increment, decrement, incrementAsync}
)(Counter)