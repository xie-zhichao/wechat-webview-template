import Router from 'next/router'
import Taro from '@tarojs/taro';

// 发送接口请求
export const send = function send(thz, payload,token) {
    thz.props.dispatch({ type: 'fetch/send', payload, userId: token })
}

// 更新数据
export const setValue = function setValue(thz, modelName, params) {
    thz.props.dispatch({ type: `${modelName}/setValue`, payload: params })
}

// 清除model
export const clearModel = function (thz, modelName) {
    thz.props.dispatch({ type: `${modelName}/clear` })
}

/**
* 自动转换分页接口数据
*/
const createListData = function createListData(inData = { records: [] }, data = { records: [] }) {
    return { data: { ...inData, ...data, records: inData.records.concat(((data.records ? data : { records: [] })).records) } }
}

/**
* 自动构建分页列表接口
*/
const createListPage = function createListPage(params = {}, current = 1, size = 10) {
    return {
        current, size, condition: params
    }
}

// 构造路由跳转
export const createRouterParams = function (params = {}) {
    let text = ''
    Object.keys(params).forEach((e) => {
        text += e + '=' + params[e] + '&';
    })
    return text;
}

// 跳转小程序网页页面
export const jumpNativeRouter = function (routerName, routerParams) {
    Taro.navigateTo({ url: `../../pages/otherView/index?viewName=${routerName}&` + createRouterParams(routerParams) })
}

// 替换小程序网页页面
export const replaceRouter = function (routerName, routerParams) {
    Taro.redirectTo({ url: `../../pages/otherView/index?viewName=${routerName}&` + createRouterParams(routerParams) })
}

// 跳转到登录页面
export const jumpLogin = function () {
    Taro.navigateTo({ url: `../../pages/login/index` })
}

// 获取pavId
export const getPavId = function () {
    return 'pavId=' + (Taro.getStorageSync('pavId') || '1')
}

// 获取临时文件
export const getTemp = function () {
    const temp = Taro.getStorageSync('temp')
    return temp ? JSON.parse(temp) : null
}

// 清空临时地址
export const clearTemp = function () {
    Taro.setStorageSync('temp', '')
}

export default {
    send,
    createListData,
    createListPage,
    jumpNativeRouter,
    jumpLogin,
    clearModel,
    getPavId,
    getTemp,
    setValue,
    clearTemp
}