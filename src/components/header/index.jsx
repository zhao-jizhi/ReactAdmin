import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal} from 'antd';
import {connect} from 'react-redux'

import {logout} from "../../redux/actions";
import LinkButton from '../../components/link-button'
import {formateDate} from "../../utils/dataUtils";
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'
import './index.less'

//头部组件
class Header extends Component{
    state = {
        currentTime: formateDate(Date.now()),
        weather: ''
    }
    // 当前时间的循环定时器，使时间1s更新一次
    getTime = () => {
        setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    // 获取最新的天气
    getWeather = async() => {
        const weather = await reqWeather(110000)
        this.setState({weather})
    }
    // 获取当前页面所对应的标题
    /*getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }*/
    // 退出登陆
    Logout = () => {
        Modal.confirm({
            content: '确认退出登陆？',
            onOk:() => {
                /*// console.log('OK');
                storageUtils.removeUser()
                this.props.history.replace('/login')*/
                this.props.logout()
            }
        });
    }

    /*
    第一次render()之后执行一次
    一般在此执行异步操作：ajax请求/启动定时器
     */
    componentDidMount () {
        this.getTime()
        this.getWeather()
    }
    render () {
        const {currentTime, weather} = this.state
        const username = this.props.user.username
        // const title = this.getTitle()
        const title = this.props.headTitle
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.Logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span className='header-bottom-time'>{currentTime}</span>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(
    state => ({headTitle: state.headTitle, user: state.user}),
    {logout}
)(withRouter(Header))