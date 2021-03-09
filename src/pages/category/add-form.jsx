import React,{Component} from 'react'
import {
    Form,
    Select,
    Input
} from 'antd'

const {Item} = Form
const {Option} = Select

const AddForm = (props) => {
    const [form] = Form.useForm()
    const {categorys,parentId} = props
    form.setFieldsValue({
        parentId,
        categoryName:''
    })
    const onValuesChange = () => {
        props.setForm(form)
    }
    return (
        <Form
            form={form}
            initialValues={{
                parentId
            }}
            onValuesChange={onValuesChange}
        >
            <Item name='parentId'>
                <Select>
                    <Option value='0'>一级分类</Option>
                    {
                        categorys.map((c) => <Option value={c._id}>{c.name}</Option>)
                    }
                </Select>
            </Item>
            <Item
                name='categoryName'
                rules={[{required: true, message: '请输入分类名称'}]}
            >
                <Input placeholder='请输入分类名称'/>
            </Item>
        </Form>
    )
}
export default AddForm