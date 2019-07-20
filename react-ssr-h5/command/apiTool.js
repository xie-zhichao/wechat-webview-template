import Router from 'next/router'

// 发送接口请求
export const send = function send(thz, payload) {
    thz.props.dispatch({ type: 'fetch/send', payload })
}

// 对指定的model进行赋值
export const setValue = function setValue(thz,modelName,payload) {
    thz.props.dispatch({type:`${modelName}/setValue`,payload})
}

// 清除model列表
export const clearList = function (thz, payload) {
    payload.forEach((e) => {
        thz.props.dispatch({ type: `${e}/clear` })
    })
}

// 获取分享路径
export const getSharePath = function (thz) {
    const router = thz.props.router
    const routerName = router.route.replace('/','');
    const params = router.asPath.split('?')[1] || ''
    return `/pages/otherView/index?viewName=${routerName}&${params}` 
}

// 获取路由参数
export const getRouterParams = function(thz) {
    return thz.props.routerParams
}

// 获取vw尺寸
export const getSize = function(size ) {
    return size  / 7.5 + 'vw'
}

// 判断是否是小程序
export const getIsWxClient = function({success,fail}) {
    let ua = navigator.userAgent.toLocaleLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger'){
        wx.miniProgram.getEnv((res)=>{
            if (res.miniprogram) {
                success && success()
            }else {
                fail && fail()
            }
        })
    }else {
        fail && fail()
    }
}

// 构造路由跳转
export const createRouterParams = function(params = {}) {
    console.log('输出结果',params);
    let text = ''
    Object.keys(params).forEach((e)=>{
        text += e + '=' + params[e] + '&';
    })
    return text;
}

// 跳转页面
export const jumpRouter = function(routerName,routerParams) {
    const token = localStorage.getItem('userIdNew')
    getIsWxClient({
        success:()=>{
            wx.miniProgram.navigateTo({ url: `../../pages/otherView/index?viewName=${routerName}&` + createRouterParams(routerParams) + '&token=' + token })
        },
        fail:()=>{
            Router.push('/' + routerName + '?' + createRouterParams(routerParams)) 
        }
    })
}

// 跳转小程序原生页面
export const jumpNativeRouter = function (routerName, routerParams) {
    const token = localStorage.getItem('userIdNew')
    getIsWxClient({
        success: () => {
            wx.miniProgram.navigateTo({ url: `../../pages/${routerName}/index?` + createRouterParams(routerParams) + '&token=' + token })
        },
        fail: () => {
            Router.push('/' + routerName + '?' + createRouterParams(routerParams)) 
        }
    })
}

// 跳转到登录页面
export const jumpLogin = function() {
    getIsWxClient({
        success:()=>{
            wx.miniProgram.navigateTo({ url: `../../pages/login/index` })
        },
        fail:()=>{
            Router.push('/login')
        }
    })
}

// 给webview发送消息
export const postMessage = function(params) {
    getIsWxClient({
        success: () => {
            wx.miniProgram.postMessage({data:params})
        },
        fail: () => {
        }
    })
}

// 返回路由
export const backRouter = function() {
    getIsWxClient({
        success: () => {
            wx.miniProgram.navigateBack()
        },
        fail: () => {
        }
    })
}

/**
* 自动转换分页接口数据
*/
const createListData = function createListData(inData = { records: [] }, data = { records: []}) {
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

// 一开始没有延迟的防抖
const debounce = (func, wait = 1000, immediate = true)=>{
    let timer, context, args;
  
    // 延迟执行函数
    const later = () =>
      setTimeout(() => {
        timer = null;
        if (!immediate) {
          func.apply(context, args);
          context = args = null;
        }
      }, wait);
  
      
    // 这里返回的函数是每次实际调用的函数
    return function(...params) {
      // 如果没有创建延迟执行函数（later），就创建一个
      if (!timer) {
        timer = later();
        if (immediate) {
          func.apply(this, params);
        } else {
          context = this;
          args = params;
        }
      } else {
        clearTimeout(timer);
        timer = later();
      }
    };
}

// 转换短文本
export const getDuanText = (text,len = 10) =>{
    return text.length > len ? text.slice(0,len) + '...' : text;
}

// 跳转到tab
export const jumpTab = function jumpTab(name) {
    getIsWxClient({
        success: () => {
            wx.miniProgram.switchTab({ url:`/pages/${name}/index`})
        },
        fail: () => {
            Router.replace('/' + name)
        }
    })
}

// 创建临时数据缓存
const createTemp = function(data){
    postMessage({type:'temp',data})
}

// 更新标题
const updateTitle = function (title) {
    document.title = title
}

export default {
    send,
    setValue,
    clearList,
    getRouterParams,
    getSize,
    jumpRouter,
    getIsWxClient,
    postMessage,
    jumpLogin,
    jumpNativeRouter,
    backRouter,
    createListData,
    createListPage,
    debounce,
    getDuanText,
    jumpTab,
    getSharePath,
    createTemp,
    updateTitle
}