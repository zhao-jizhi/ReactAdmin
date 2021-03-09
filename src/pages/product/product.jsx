import React,{Component} from 'react'
import { Switch, Route, Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductDetail from './detail'
import ProductAddUpdate from './add-update'

export default class Product extends Component {
    render(){
        return (
            <Switch>
                <Route path='/product' component={ProductHome} exact></Route> {/*路径完全匹配*/}
                <Route path='/product/detail' component={ProductDetail}></Route>
                <Route path='/product/addupdate' component={ProductAddUpdate}></Route>
                <Redirect to='/product'/>
            </Switch>
        )
    }
}