import React,{Component} from 'react'
import {
    Form,
    Input,
    Select
} from 'antd'

const {Item} = Form
const {Option} = Select

export default class AddUser extends Component{
    formRef = React.createRef()

    onValuesChange = () => {
        this.props.setForm(this.formRef.current)
    }

    render () {
        const {roles, user} = this.props
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        }
        return (
            <Form
                {...layout}
                ref={this.formRef}
                preserve='flase'
                onValuesChange={this.onValuesChange}
            >
                <Item
                    label='用户名'
                    name='username'
                    initialValue={user.username}
                    rules={[
                        {required: true, message: '请输入用户名'}
                    ]}
                >
                    <Input placeholder='请输入用户名'/>
                </Item>
                {
                    user._id ? null : (
                        <Item
                            label='密码'
                            name='password'
                            rules={[
                                {required: true, message: '请输入密码'}
                            ]}
                        >
                            <Input type='password' placeholder='请输入密码'/>
                        </Item>
                    )
                }
                <Item
                    label='手机号'
                    name='phone'
                    initialValue={user.phone}
                    rules={[
                        {required: true, message: '请输入手机号'}
                    ]}
                >
                    <Input type='tel' placeholder='请输入手机号'/>
                </Item>
                <Item
                    label='邮箱'
                    name='email'
                    initialValue={user.email}
                    rules={[
                        {required: true, message: '请输入邮箱'}
                    ]}
                >
                    <Input type='email' placeholder='请输入邮箱'/>
                </Item>
                <Item
                    label='角色'
                    name='role_id'
                    initialValue={user.role_id}
                    rules={[
                        {required: true, message: '请选择角色'}
                    ]}
                >
                    <Select placeholder='请选择角色'>
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}