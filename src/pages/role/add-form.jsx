import React,{Component} from 'react'
import {
    Form,
    Input
} from 'antd'

const {Item} = Form

export default class AddForm extends Component {

    formRef = React.createRef()

    onValuesChange = () => {
        this.props.setForm(this.formRef.current)
    }

    render(){
        return (
            <Form ref={this.formRef} preserve={false} onValuesChange={this.onValuesChange}>
                <Item
                    label='角色名称'
                    name='roleName'
                    rules={[{required: true, message: '必须输入角色名称'}]}
                >
                    <Input/>
                </Item>
            </Form>
        )
    }
}