import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

/*
登陆的路由组件
 */
export default class Login extends Component {
    onFinish = async (values) => {
        // console.log('接收到的数据为', values)
        const {username, password} = values
        const result = await reqLogin(username, password)
        // console.log('请求成功', response.data)
        if(result.status === 0) {
            message.success('登陆成功')
            //保存user
            const user = result.data
            memoryUtils.user = user
            storageUtils.saveUser(user)
            this.props.history.replace('/')
        }else{
            message.error(result.msg)
        }
    }
    render () {
        const user = <memoryUtils className="user"></memoryUtils>
        if (user._id) {
            return <Redirect to='/' />
        }
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登陆</h2>
                    <Form className="login-form" onFinish={this.onFinish} initialValues={{username:'admin'}}>
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: '请输入用户名'},
                                { min: 4, message: '用户名至少为4位'},
                                { max: 12, message: '用户名最多12位'},
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线的组成'}
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined style={{color:'rgba(0,0,0,.25)'}} />}
                                placeholder="用户名"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { validator: (_, value) => {
                                        if(!value){
                                            return Promise.reject('密码必须输入')
                                        }else if(value.length<4){
                                            return Promise.reject('密码至少为4位')
                                        }else if(value.length>12){
                                            return Promise.reject('密码最多为12位')
                                        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
                                            return Promise.reject('密码必须是英文、数字或下划线的组成')
                                        }
                                        return Promise.resolve()
                                    }
                                }
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined type="lock" style={{color:'rgba(0,0,0,.25)'}} />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登陆
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
