/*
包含应用中所有请求函数的模块
 */

import jsonp from 'jsonp'
import {message} from 'antd'
import ajax from './ajax'

//登陆
/*
export function reqLogin(username, password) {
    return ajax('/login', {username, password}, 'POST')
}*/
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

//  获取分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list', {parentId})
//  添加分类
export const reqAddCategorys = (parentId,categoryName) => ajax('/manage/category/add', {parentId,categoryName}, 'POST')
//  更新分类
export const reqUpdateCategorys = ({categoryId,categoryName}) => ajax('/manage/category/update', {categoryId,categoryName}, 'POST')

//  获取商品列表
export const reqProducts = (pageNum,pageSize) => ajax('/manage/product/list', {pageNum,pageSize})
//  根据搜索获取商品列表
export const reqSearchProducts = ({pageNum, pageSize, searchType, searchName}) => ajax('/manage/product/search', {pageNum, pageSize, [searchType]:searchName})
//  根据分类ID获取分类
export const reqCategory = (categoryId) => ajax('/manage/category/info', {categoryId})
//  对商品进行上/下架处理(更新商品状态)
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')

//  删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, "POST")

//  添加/修改商品
export const reqAddUpdateProduct = (product) => ajax('/manage/product/'+(product._id ? 'update' : 'add'), product, 'POST' )

//  获取角色列表
export const reqRoles =() => ajax('/manage/role/list')
//  添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')
//  更新角色
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')

//  获取用户列表
export const reqUsers = () => ajax('/manage/user/list')
//  添加用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')
//  删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', {userId}, 'POST')

// jsonp请求的接口请求函数
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=6a1f060239e8acea5a4f1dc0cf2fe9f6&output=json`
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()',err, data)
            if (!err && data.status==='1') {
                const weather = data.lives[0].weather
                resolve(weather)
            } else {
                message.error('获取天气信息出错')
            }
        })
    })
}
// reqWeather(110000)