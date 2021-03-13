import React,{Component} from 'react'
import {
    Card,
    Button,
    Table,
    message,
    Modal
} from 'antd'
import {connect} from 'react-redux'

import {logout} from "../../redux/actions";
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'
import {PAGE_SIZE} from '../../utils/constents'
import {formateDate} from '../../utils/dataUtils'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from "../../utils/memoryUtils"
import storageUtils from "../../utils/storageUtils"

class Role extends Component {
    state = {
        roles: [],
        role: {},
        isShowAdd: false,
        isShowAuth: false
    }

    constructor (props) {
        super(props)
        this.auth = React.createRef()
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },{
                title: '创建时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },{
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }

    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({role})
            }
        }
    }

    //  获得角色列表
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({roles})
        } else {
            message.error('获取角色列表失败！')
        }
    }

    //  创建角色
    addRole = () => {
        return new Promise((resolve, reject) => {
            this.form.validateFields().then(async values=> {
                this.setState({isShowAdd: false})
                const {roleName} = values
                const result = await reqAddRole(roleName)
                if (result.status === 0) {
                    message.success('创建角色成功！')
                    const role = result.data
                    this.setState({
                        roles: [...this.state.roles, role]
                    })
                } else {
                    message.error('创建角色失败！')
                }
            })
        })
    }

    //  更新角色
    updateRole = async () => {
        this.setState({isShowAuth: false})
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = this.props.user.username

        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            if (role._id === this.props.user.role_id) {
                this.props.logout()
                message.success('当前用户角色权限已更新，请重新登陆！')
            } else {
                message.success('设置角色权限成功')
                this.setState({
                    roles: [...this.state.roles]
                })
            }
        }
    }

    componentWillMount () {
        this.initColumn()
    }

    componentDidMount () {
        this.getRoles()
    }

    render(){
        const {roles, role, isShowAdd, isShowAuth} = this.state
        const title = (
            <span>
                <Button
                    type='primary'
                    onClick={() => {this.setState({isShowAdd:true})}}
                >创建角色</Button> &nbsp; &nbsp;
                <Button
                    type='primary'
                    disabled={!role._id}
                    onClick={() => {this.setState({isShowAuth:true})}}
                >设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                    rowKey='_id'
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {this.setState({role})}
                    }}
                    onRow={this.onRow}
                />
                <Modal
                    title="创建角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {this.setState({isShowAdd: false})}}
                    destroyOnClose
                >
                    <AddForm setForm={(form)=>this.form = form}/>
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {this.setState({isShowAuth: false})}}
                >
                    <AuthForm ref={this.auth} role={role}/>
                </Modal>
            </Card>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {logout}
)(Role)