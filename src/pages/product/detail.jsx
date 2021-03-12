import React,{Component} from 'react'
import {
    Card,
    List
} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constents'
import {reqCategory} from "../../api";
import memoryUtils from "../../utils/memoryUtils";

const Item = List.Item

export default class ProductDetail extends Component {
    state = {
        cName1: '',// 一级分类名称
        cName2: ''// 二级分类名称
    }
    async componentDidMount () {
        const {pCategoryId, categoryId} = memoryUtils.product
        if (pCategoryId === '0') {
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        } else {
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({cName1, cName2})
        }
    }
    componentWillUnmount () {
        memoryUtils.product = {}
    }
    render () {
        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined onClick={() => this.props.history.goBack()} />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        const {name, desc, price, detail, imgs} = memoryUtils.product
        console.log(memoryUtils.product)
        const {cName1, cName2} = this.state
        return (
            <Card title={title} className='product-detail'>
                <List >
                    <Item>
                        <div>
                            <span className='left'>商品名称：</span>
                            <span>{name}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className='left'>商品描述：</span>
                            <span>{desc}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className='left'>商品价格：</span>
                            <span>{'￥'+price}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className='left'>所属分类：</span>
                            <span>{cName1}{cName2 ? ' --> '+cName2 : ''}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className='left'>商品图片：</span>
                            {
                                imgs.map(img => (
                                    <img
                                        key={img}
                                        src={BASE_IMG_URL + img}
                                        alt='img'
                                        className='product-img'
                                    />
                                ))
                            }
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className='left'>商品详情：</span>
                            <span dangerouslySetInnerHTML={{__html: detail}}>
                            </span>
                        </div>

                    </Item>
                </List>
            </Card>
        )
    }
}