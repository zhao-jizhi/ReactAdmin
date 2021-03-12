import React,{Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu } from 'antd';
import {connect} from 'react-redux'

import {setHeadTitle} from '../../redux/actions';
import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig'
import memoryUtils from "../../utils/memoryUtils";

const { SubMenu } = Menu;

//左侧导航组件
class LeftNav extends Component{

    hasAuth = (item) => {
        const {key, isPublic} = item
        const {username} = this.props.user
        const {menus} = this.props.user.role
        if (username === 'admin' || menus.indexOf(key) !== -1 || isPublic) {
            return true
        } else if (item.children) {
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }

    /*根据menuList的数据数组生成对应的标签数组
    使用map() + 递归调用*/
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            //两种可能性，一种有children，一种没有
            if (!item.children) {
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {/*递归调用*/}
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    /*使用reduce() + 递归调用*/
    getMenuNodes = (menuList) => {
        const  path = this.props.location.pathname
        return menuList.reduce((pre, item) => {
            if (this.hasAuth(item)) {
                if (!item.children) {
                    if (path.indexOf(item.key) === 0) {
                        this.props.setHeadTitle(item.title)
                    }
                    pre.push((
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key} onClick={() => {this.props.setHeadTitle(item.title)}}>
                                {item.title}
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    //查找一个与当前路径匹配的子item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                    if (cItem) {
                        this.openKey = item.key
                    }

                    pre.push((
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {/*递归调用*/}
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre
        },[])
    }
    /*
    在第一次render()之前执行一次
    为第一个render()准备数据(同步的)
    */
    componentWillMount () {
        this.menuNodes = this.getMenuNodes(menuList)
    }
    render (){
        //得到当前请求的路由路径
        let path = this.props.location.pathname
        if (path.indexOf('/product')===0) {
            path = '/product'
        }
        //得到需要打开的菜单项的key
        const openKey = this.openKey
        return (
            <div className='left-nav'>
                <Link to='/home' className='left-nav-header'>
                    <img src={logo} alt='logo' />
                    <h1>硅谷后台</h1>
                </Link>

                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {/*<Menu.Item key="/home" icon={<PieChartOutlined />}>
                        <Link to='/home'>首页</Link>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                        <Menu.Item key="/category" icon={<MailOutlined />}>
                            <Link to='/category'>品类管理</Link>
                        </Menu.Item>
                        <Menu.Item key="/product" icon={<MailOutlined />}>
                            <Link to='/product'>商品管理</Link>
                        </Menu.Item>
                    </SubMenu>*/}
                    {
                        this.menuNodes
                    }

                </Menu>
            </div>
        )

    }
}

export default connect(
    state => ({user: state.user}),
    {setHeadTitle}
)(withRouter(LeftNav))