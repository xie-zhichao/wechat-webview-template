import Taro from '@tarojs/taro';
const isDev = false
const getWebView = function getWebView(){
    return isDev?'http://192.167.5.69:3011':'http://nongqibang.com:7006'
}

// 转换url数据
const tranUrl = function tranUrl(params,path) {
    const newParams = Object.assign({},params)
    let str = ''
    let url = newParams.viewName
    if (newParams.pavId) {
        Taro.setStorageSync('pavId', newParams.pavId)
    }
    delete newParams.viewName;
    Object.keys(newParams).forEach((e) => {
        str += e + '=' + newParams[e] + '&'
    })
    return getWebView() + '/' + (path ? path : url) + '?' + str 
}

// 转换参数
const tranParams = function tranParams(params) {
    let str = ''
    const newObj = Object.assign({}, params)
    delete newObj.viewName;
    Object.keys(newObj).forEach((e) => {
        str += e + '=' + newObj[e] + '&'
    })
    return str
}

export default {
    getWebView,
    tranUrl,
    tranParams
}