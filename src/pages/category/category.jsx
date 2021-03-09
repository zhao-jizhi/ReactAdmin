import React,{Component} from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategorys, reqAddCategorys } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component {
    state = {
        isLoading: false,
        categorys: [],
        subCategorys: [],
        parentId: '0',
        parentName: '',
        showStatus: 0
    }
    // 初始化Table所有列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
                    </span>
                )
            }
        ]
    }

    //展示一级分类数据
    showCategorys = ()=> {
        this.setState({
            subCategorys: [],
            parentId: '0',
            parentName: ''
        })
    }

    // 展示指定一级分类的子分类数据
    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            this.getCategorys()
        })

    }

    // 异步获取分类数据
    getCategorys = async (parentId) => {
        // 在发请求前显示loading
        this.setState({isLoading:true})
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        // 在请求完成后隐藏loading
        this.setState({isLoading:false})
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                this.setState({
                    categorys
                })
            }else {
                this.setState({
                    subCategorys: categorys
                })
            }

        } else {
            message.error('获取分类数据失败')
        }
    }

    // 展示添加分类确认框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    //添加分类
    addCategory = () => {
        return new Promise((resolve, reject) => {
            this.form.validateFields().then(async values=> {
                this.setState({showStatus: 0})
                //准备数据
                const {parentId, categoryName} = values
                //发送更新分类的请求
                const result = await reqAddCategorys(parentId, categoryName)
                // 重新展示列表
                if (result.status === 0) {
                    if (parentId === this.state.parentId) {
                        this.getCategorys()
                    } else if (parentId === '0') {
                        this.getCategorys('0')
                    }
                }
            })
        })
    }

    // 展示修改分类确认框
    showUpdate = (category) => {
        //保存分类对象
        this.category = category
        //更新数据
        this.setState({
            showStatus: 2
        })
    }

    // 修改分类
    updateCategory = () => {
        return new Promise((resolve, reject) => {
            this.form.validateFields().then(async values=>{
                // 隐藏确认框
                this.setState({showStatus: 0})
                //准备数据
                const categoryId = this.category._id
                const {categoryName} = values
                //  发送更新分类的请求
                const result = await reqUpdateCategorys({categoryId,categoryName})
                // 重新展示列表
                if (result.status===0) {
                    this.getCategorys()
                }
            })
        })

    }

    // 取消确认框
    handleCancel = () => {
        this.setState({
            showStatus: 0
        })
    }

    //  为第一次render()准备数据
    componentWillMount () {
        this.initColumns()
    }

    //  执行异步任务
    componentDidMount () {
        this.getCategorys()
    }

    render(){
        const {categorys, isLoading, parentId, subCategorys, parentName, showStatus } = this.state
        const category = this.category || {}
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{marginRight: 5}}/>
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        )

        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        bordered
                        rowKey='_id'
                        loading={isLoading}
                        dataSource={parentId === '0' ? categorys : subCategorys}
                        columns={this.columns}
                        pagination={{defaultPageSize: 5, showQuickJumper: true, pageSizeOptions: [5,10,15]}}
                    />
                    <Modal title="添加分类" visible={showStatus===1} onOk={this.addCategory} onCancel={this.handleCancel}>
                        <AddForm categorys={categorys} parentId={parentId} setForm={(form) => {this.form=form}}/>
                    </Modal>
                    <Modal title="修改分类" visible={showStatus===2} onOk={this.updateCategory} onCancel={this.handleCancel}>
                        <UpdateForm categoryName={category.name} setForm={(form) => {this.form=form}}/>
                    </Modal>
                </Card>
            </div>
        )
    }
}