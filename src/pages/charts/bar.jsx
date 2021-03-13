import React,{Component} from 'react'
import {
    Card,
    Button
} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Bar extends Component {
    state = {
        sales: [120, 200, 150, 80, 70, 110, 130],
        stores: [50, 156, 234, 15, 29, 260, 350]
    }

    update = () => {
        this.setState(state => ({
            sales: state.sales.map(sale => sale+1),
            stores: state.stores.reduce((pre,store) => {
                pre.push(store-1)
                return pre
            },[])
        }))
    }

    getOption = (sales, stores) => {
        return {
            tooltip: {},
            legend: {
                data:['销量', '库存']
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '销量',
                    data: sales,
                    type: 'bar'
                },{
                    name: '库存',
                    data: stores,
                    type: 'bar'
                }
            ]
        }
    }
    render(){
        const {sales, stores} = this.state
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.update}>更新</Button>
                </Card>
                <Card title='柱状图一'>
                    <ReactEcharts option={this.getOption(sales, stores)}/>
                </Card>
            </div>
        )
    }
}