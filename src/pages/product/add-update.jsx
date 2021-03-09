import React,{Component} from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Button,
    message
} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddUpdateProduct} from "../../api";
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const {Item} = Form
const {TextArea} = Input


export default class ProductAddUpdate extends Component{

    state = {
        options: []
    }
    formRef = React.createRef()

    constructor (props) {
        super(props)
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    //  初始化分类列表
    initOptions = async (categorys) => {
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
        }))
        //  如果是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {pCategoryId} = product
        if (isUpdate && pCategoryId !== '0') {
            const subCategorys = await this.getCategorys(pCategoryId)
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            const targetOption = options.find(option => option.value === pCategoryId)
            targetOption.children = childOptions
        }
        this.setState({options})
    }
    //  异步获取一级、二级列表
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                this.initOptions(categorys)
            } else {
                return categorys
            }
        }
    }
    //  加载下一列表的回调函数
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0]
        targetOption.loading = true;
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false;
        if (subCategorys && subCategorys.length > 0) {
            targetOption.children = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
        } else {
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...this.state.options]
        })

    }
    //  自定义价格的校验规则
    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            callback()
        } else {
            callback('价格必须大于0')
        }
    }
    //  提交表单
    onFinish = async (values) => {
        const {name, desc, price, categoryIds} = values
        let pCategoryId, categoryId
        if(categoryIds.length === 1) {
            pCategoryId = '0'
            categoryId = categoryIds[0]
        } else {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()
        const product = {name, desc, price, pCategoryId, categoryId, imgs, detail}

        if(this.isUpdate) {
            product._id = this.product._id
        }

        const result = await reqAddUpdateProduct(product)

        if (result.status === 0) {
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功！`)
            this.props.history.goBack()
        } else {
            message.error(`${this.isUpdate ? '更新' : '添加'}商品失败！`)
        }

    }

    componentDidMount () {
        this.getCategorys('0')
    }

    componentWillMount () {
        //取出携带的state
        const product = this.props.location.state
        //保存是否是更新标识
        this.isUpdate = !!product
        this.product = product || {}
    }
    render () {
        const {isUpdate, product} = this
        const {pCategoryId, categoryId} = product
        const categoryIds = []
        if (isUpdate) {
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined/>
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        return (
            <Card title={title}>
                <Form
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 8 }}
                    ref={this.formRef}
                    onFinish={this.onFinish}
                >
                    <Item
                        label='商品名称'
                        name='name'
                        initialValue={product.name}
                        rules={[{
                            required: true, message: '请输入商品名称'
                        }]}
                    >
                        <Input placeholder='请输入商品名称'/>
                    </Item>
                    <Item
                        label='商品描述'
                        name='desc'
                        initialValue={product.desc}
                        rules={[{
                            required: true, message: '请输入商品描述'
                        }]}
                    >
                        <TextArea placeholder='请输入商品描述'/>
                    </Item>
                    <Item
                        label='商品价格'
                        name='price'
                        initialValue={product.price}
                        rules={[
                            {required: true, message: '请输入商品价格'},
                            {validator: this.validatePrice}
                        ]}
                    >
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元'/>
                    </Item>
                    <Item
                        label='商品分类'
                        name='categoryIds'
                        initialValue={categoryIds.length>0 ? categoryIds : undefined}
                        rules={[{
                            required: true, message: '请选择商品分类'
                        }]}
                    >
                        <Cascader placeholder='选择商品分类' options={this.state.options} loadData={this.loadData}/>
                    </Item>
                    <Item label='商品图片' name='imgs'>
                        <PicturesWall ref={this.pw} imgs={product.imgs}/>
                    </Item>
                    <Item label='商品详情' name='detail' labelCol={{ span: 2 }} wrapperCol={{ span: 18 }}>
                        <RichTextEditor ref={this.editor} detail={product.detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' htmlType="submit">提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

