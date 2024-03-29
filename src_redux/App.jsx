import React,{Component} from 'react'

import {increment, decrement} from './redux/actions'

export default class App extends Component {

    constructor (props) {
        super(props)
        this.number = React.createRef()
    }
    increment = () => {
        const number = this.number.current.value * 1
        this.props.store.dispatch(increment(number))
    }
    decrement = () => {
        const number = this.number.current.value * 1
        this.props.store.dispatch(decrement(number))
    }
    incrementIfOdd = () => {
        const number = this.number.current.value * 1
        if (this.props.store.getState() % 2 === 1) {
            this.props.store.dispatch(increment(number))
        }
    }
    incrementAsync = () => {
        const number = this.number.current.value * 1
        setTimeout(()=>{
            this.props.store.dispatch(increment(number))
        }, 1000)
    }
    render () {
        const count = this.props.store.getState()
        return (
            <div>
                <p>click {count} times</p>
                <select ref={this.number}>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                </select>&nbsp;&nbsp;
                <button onClick={this.increment}>+</button>&nbsp;&nbsp;
                <button onClick={this.decrement}>-</button>&nbsp;&nbsp;
                <button onClick={this.incrementIfOdd}>increment if odd</button>&nbsp;&nbsp;
                <button onClick={this.incrementAsync}>increment async</button>
            </div>
        )
    }
}