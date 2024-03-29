import React,{Component} from 'react'
import {
    Card,
    Statistic,
    DatePicker,
    Timeline
} from 'antd'

import {ArrowUpOutlined, ArrowDownOutlined, QuestionCircleOutlined, ReloadOutlined} from '@ant-design/icons'
import moment from 'moment'

import Line from './line'
import Bar from './bar'
import './home.less'

const dateFormat = 'YYYY/MM/DD'
const {RangePicker} = DatePicker

export default class Home extends Component {
    state = {
        isVisited: true
    }

    handleChange = (isVisited) => {
        return () => this.setState({isVisited})
    }

    render() {
        const {isVisited} = this.state
        const title = (
            <div className="home-menu">
                <span
                    className={isVisited ? "home-menu-active home-menu-visited" : 'home-menu-visited'}
                    onClick={this.handleChange(true)}
                >访问量</span>
                <span
                    className={isVisited ? "" : 'home-menu-active'}
                    onClick={this.handleChange(false)}
                >销售量</span>
            </div>
        )
        const extra = (
            <RangePicker
                defaultValue={[moment('2019/01/01', dateFormat), moment('2019/06/01', dateFormat)]}
                format={dateFormat}
            />
        )
        return (
            <div className='home'>
                <Card
                    className='home-card'
                    title='商品总量'
                    style={{width: 250}}
                    extra={<QuestionCircleOutlined />}
                    headStyle={{color: 'rgba(0,0,0,.45)'}}
                >
                    <Statistic
                        value={1128163}
                        suffix='个'
                        style={{fontWeight: 'bolder'}}
                    />
                    <Statistic
                        value={15}
                        prefix='周同比'
                        suffix={<span>% <ArrowDownOutlined style={{color: 'red'}}/></span>}
                        valueStyle={{fontSize: 15}}
                    />
                    <Statistic
                        value={10}
                        prefix='日同比'
                        suffix={<span>% <ArrowUpOutlined style={{color: 'green'}}/></span>}
                        valueStyle={{fontSize: 15}}
                    />
                </Card>
                <Line/>
                <Card
                    className="home-content"
                    title={title}
                    extra={extra}
                >
                    <Card
                        className="home-table-left"
                        title={isVisited ? '访问趋势' : '销售趋势'}
                        bodyStyle={{padding: 0, height: 275}}
                        extra={<ReloadOutlined />}
                    >
                        <Bar/>
                    </Card>

                    <Card title='任务' extra={<ReloadOutlined />} className="home-table-right">
                        <Timeline>
                            <Timeline.Item color="green">新版本迭代会</Timeline.Item>
                            <Timeline.Item color="green">完成网站设计初版</Timeline.Item>
                            <Timeline.Item color="red">
                                <p>联调接口</p>
                                <p>功能验收</p>
                            </Timeline.Item>
                            <Timeline.Item>
                                <p>登录功能设计</p>
                                <p>权限验证</p>
                                <p>页面排版</p>
                            </Timeline.Item>
                        </Timeline>
                    </Card>
                </Card>
            </div>
        )
    }
}