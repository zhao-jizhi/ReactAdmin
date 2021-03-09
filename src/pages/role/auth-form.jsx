import React,{Component} from 'react'
import {
    Form,
    Input,
    Tree,
    TreeNode
} from 'antd'
import menuList  from '../../config/menuConfig'

const {Item} = Form

export default class AuthForm extends Component {

    constructor (props) {
        super(props)
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    //  获得树形控件的数据
    getTreeData = (menuList) => {
        this.treeData = [{
            title: '平台权限',
            key: 'all',
            children: [...menuList]
        }]
    }

    //  点击复选框
    onCheck = checkedKeys => {
        // console.log(checkedKeys)
        this.setState({checkedKeys})
    }

    //  为父组件提供获取menus的方法
    getMenus = () => this.state.checkedKeys

    componentWillMount () {
        this.getTreeData(menuList)
    }

    componentWillReceiveProps (nextProps) {
        // console.log('componentWillReceiveProps()', nextProps)
        const menus = nextProps.role.menus
        /*this.setState({
            checkedKeys: menus
        })*/
        this.state.checkedKeys = menus
    }

    render(){
        const {role} = this.props
        const {checkedKeys} = this.state
        return (
            <div>
                <Item label='角色名称'>
                    <Input value={role.name} disabled/>
                </Item>
                <Tree
                    treeData={this.treeData}
                    checkable
                    defaultExpandAll
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                />
            </div>
        )
    }
}