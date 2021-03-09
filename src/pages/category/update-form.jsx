import React,{Component} from 'react'
import {
    Form,
    Input
} from 'antd'

const {Item} = Form

const UpdateForm = (props) => {
    const [form] = Form.useForm();
    const {categoryName} = props
    form.setFieldsValue({
        categoryName
    })
    const onValuesChange = () => {
        props.setForm(form)
    }
    return (
        <Form form={form} initialValues={{categoryName}} onValuesChange={onValuesChange}>
            <Item
                name='categoryName'
                rules={[{required: true, message: '请输入分类名称'}]}
            >
                <Input placeholder='请输入分类名称'/>
            </Item>
        </Form>
    )
}

export default UpdateForm