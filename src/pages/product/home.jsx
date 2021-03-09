import React,{Component} from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    message
} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constents'
import './product.less'

const Option = Select.Option


export default class ProductHome extends Component {
    state = {
        products: [],
        total: 0,
        loading: false,
        searchType: 'productName',
        searchName: ''
    }
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'desc'
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price
            },
            {
                width: 100,
                title: '状态',
                render: (product) => {
                    const {status, _id} = product
                    return (
                        <span>
                            <Button type='primary' onClick={() => this.updateStatus(_id, status===1 ? 2 : 1)}>{status===1 ? '下架' : '上架'}</Button>
                            <span>{status===1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            <LinkButton
                                onClick={() => this.props.history.push('/product/detail', {product})}
                            >
                                详情
                            </LinkButton>
                            <LinkButton
                                onClick={() => this.props.history.push('/product/addupdate', product)}>
                                修改
                            </LinkButton>
                        </span>
                    )
                }
            }
        ]
    }
    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        this.setState({loading: true})
        const {searchName, searchType} = this.state
        let result
        if (searchName) {
            result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchType, searchName})
        } else {
            result = await reqProducts(pageNum,PAGE_SIZE)
        }

        this.setState({loading: false})
        if (result.status === 0) {
            const {list, total} = result.data
            this.setState({products: list, total})
        }
    }
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('更新状态成功')
            this.getProducts(this.pageNum)
        }
    }
    componentWillMount () {
        this.initColumns()
    }
    componentDidMount () {
        this.getProducts(1)
    }
    render () {
        const {products, total, loading, searchType, searchName} = this.state
        const title = (
            <span>
                <Select
                    style={{width: 120}}
                    value={searchType}
                    onChange={value => this.setState({searchType: value})}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{width: 200, margin: '0 15px'}}
                    value={searchName}
                    onChange={event => this.setState({searchName: event.target.value})}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <PlusOutlined />
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    loading={loading}
                    bordered
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        total,
                        current: this.pageNum,
                        showSizeChanger: false,
                        showQuickJumper: true,
                        defaultPageSize: PAGE_SIZE,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}