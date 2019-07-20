# 小程序内嵌webview 采坑实录
本项目包含两个子项目
1.wechat
使用taro创建的初始化项目
2.react-ssr-h5
使用nextjs创建的项目 已经做好完整的兼容处理 使用vw vh为单位

# 简单介绍
因小程序对于webview通信做出的限制 从webview发起的postMessage并不会实时的被小程序端接受到
详情可见:https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html

登录 分享 支付 视频上传 这几块是没法使用webview来实现的 必须用小程序原生来写
所以如果想使用小程序内嵌webview的朋友 这里要提个醒

# webview跳转小程序
webview - 通过jumpRouter - 跳转到小程序的other页面
实际转换:
Taro.navigateTo({ url: `../../pages/otherView/index?viewName=${routerName}&` + createRouterParams(routerParams) })
通过这种方式 就会在小程序原生router中push一个路由 从而达到跟小程序打开原生页面一致的效果
在webview中发起的任何一个postMessage 也都会在这个otherView中进行统一的处理


# 提醒 
下面使用到的apitool都是对应项目里面的 而不是共用一个

# wechat api
```javascript
    小程序项目中跳转页面并传参
    jumpNativeRouter
    使用方式:
    apitool.jumpNativeRouter(routerName,params : object)
```

```javascript
    替换小程序网页页面
    replaceRouter
    使用方式:
    apitool.replaceRouter(routerName,params : object)
```

```javascript
    获取临时缓存区数据
    getTemp
    使用方式:
    Object apitool.getTemp()
    备注:
   请见缓存区说明
```

```javascript
   销毁临时缓存区
   clearTemp
   使用方式:
   apitool.clearTemp()
   备注:
   请见缓存区说明
```

# react-ssr-h5 api
```javascript
    获取小程序分享以后的路径 转换成obj的格式
    getSharePath
    使用方式:
    Object apitool.getSharePath(this)
```

```javascript
    获取路由参数
    getRouterParams
    使用方式:
    Object apitool.getRouterParams(this)
```

```javascript
    获取转换以后的尺寸
    getSize
    使用方式:
    String apitool.getSize(size)
    备注:
    因为ssr项目里面使用了postcss-px-to-viewport的关系在less里面写的px会自动转换成vw 但是行内样式不行 所以你需要使用这个来转换一下
```

```javascript
    获取当前运行环境
    getIsWxClient
    使用方式:
    apitool.getIsWxClient({success,fail})
    备注:
    成功或者失败都会调用对应的回调 但是这里只判断了MicroMessenger是否存在 无法得知当前是微信小程序在用还是微信内打开网页 所以如果你是直接从公众号迁移 要保证公众号功能都正常使用的话 这边还得做个判断
```

```javascript
    将路由参数转换成string
    createRouterParams
    使用方式:
    String apitool.createRouterParams(obj)
```

```javascript
    跳转到小程序other原生页面
    jumpRouter
    使用方式:
    apitool.jumpRouter(routerName:String,routerParams:Object)
    备注:
    请看上面注意中写的介绍
```

```javascript
    跳转小程序原生页面
    jumpNativeRouter
    使用方式:
    apitool.jumpNativeRouter(routerName:String,routerParams:Object)
    备注:
    这个可以用来跳转分享 支付 登录等小程序pages下面的原生页面
```

```javascript
    跳转原生登录页面
    jumpLogin
    使用方式:
    apitool.jumpLogin()
```

```javascript
    从webview发起请求到小程序
    postMessage
    使用方式:
    apitool.postMessage({type:'xxx',data:{}})
    备注:
    具体详情请看后面介绍
```

```javascript
    返回页面
    backRouter
    使用方式:
    apitool.backRouter()
```

```javascript
    跳转tab
    jumpTab
    使用方式:
    apitool.jumpTab(tabName:String || 'home') 
```

```javascript
    创建临时缓存区
    createTemp
    使用方式
    apitool.createTemp(obj)
    备注:
    请看缓存区说明
```

```javascript
    动态更新webview标题
    updateTitle
    使用方式:
    apitool.updateTitle(string)
    备注:
    微信小程序中使用的标题是根据当前页面的webview标题来的所以如果你想进入页面的时候显示对应的商品名称 就调用这个即可
```

# 缓存区说明
因小程序对于webview限制的原因 所以如果你有以下场景 那么可以考虑用缓存区来传递数据
比如从支付中跳转到地址选择或者优惠券选择等webview选择页面的时候 如果想要回显webview页面选中的东西 因为小程序webview的限制 没法两者之间直接通信 所以就需要创建一个缓存区来获取数据

# 登录为何使用原生?
起初我项目中也是使用webview配合jssdk的授权方式来做登录 但是这个方案会有几点问题
1.使用jssdk授权 必须使用80端口
2.使用jssdk处理登录的话 在小程序里面 体验不好 会导致你页面有可能会出现频繁的跳转 难以控制
3.后台必须为此写一个接口来生成对应的签名

# 登录说明
登录这边有一点必须注意的是 必须使用webview保存的token 绝对不要尝试在小程序里面去保存token
因为当你删除小程序的时候 微信只会清空小程序的缓存数据 但是不会清空对应的webview的缓存数据
这会导致你小程序那边没登录 但是webview那边还是登录的状态 所以一般都是在跳转页面到小程序那边的时候直接传递一个token过去来解决这个问题

# webview页面刷新
场景:
比如你新增了某条数据或者编辑删除了某条数据 想让上一个页面刷新的话
只需要在wechat - otherView中将你想要刷新的routerName添加进去即可
```javascript
    const { viewName } = this.$router.params
    // 强制指定页面刷新
    if ([这里就是你想要刷新的路由名字].indexOf(viewName) !== -1 && this.init) {
      Taro.redirectTo({ url: `../../pages/otherView/index?viewName=${viewName}&` + util.tranParams(this.$router.params) })
    }
```


# 页面分享
如果你想要你的页面有分享功能 那么只需要在webview端发起一个apitool.postMessage即可
如果你想要控制分享的标题与内容的话 
可以按照这种格式进行发送
```javascript
apitool.postMessage({type:'share',data:{
    title:'分享标题',
    path:'分享路径',
    shareUrl:'分享的图片url'
}})
```

# 其他处理
如果你想要让你的应用具备更多的扩展性的话 可以在wechat - otherView - onMessage中增加对应的判断


# nodeServer
在react-ssr-h5根目录下面有个nodeServer的文件
这个文件是一个js授权的本地服务器版本 如果你想用jssdk的一些功能来进行授权的话可以在项目中执行npm run wechat来开启这个服务
appid跟secret都被我删除了 你需要自己手动替换一下
页面授权在_app.js文件中


# postcss.config说明
react-ssr-h5使用的是vw vh为单位 所以设计搞那边如果宽高不是750 * 1334的话 需要postcss.config.js中对对应的修改
```json
        "postcss-px-to-viewport": {
            viewportWidth: 750,     // (Number) The width of the viewport.
            viewportHeight: 1334,    // (Number) The height of the viewport.
            unitPrecision: 3,       // (Number) The decimal numbers to allow the REM units to grow to.
            viewportUnit: 'vw',     // (String) Expected units.
            selectorBlackList: ['.ignore', '.hairlines'],  // (Array) The selectors to ignore and leave as px.
            minPixelValue: 1,       // (Number) Set the minimum pixel value to replace.
            mediaQuery: false       // (Boolean) Allow px to be converted in media queries.
        },
```

# react-ssr-h5提醒
这个项目在启动或者export的时候都做了处理 
你只需要在pages里面添加内容即可 
不需要在server中再去编写指定的路由 也无需在export的时候编写路由
你对pages做的改动都会实时刷新

# 服务端渲染建议
1.不要在网页中引入antd库 尤其不要使用带有icon的组件 如input
引入这个将会导致你的体积直接增加140k 因为antd的图标是全量引入的
2.使用swiper之类的库 可以采用cdn的方式引入而不是npm 这样可以使你的打包体积变得更小
3.建议使用webp而非png只需要在url中?webp即可 已经安装了对应的插件库
4.尽量全部使用css module而非全局样式

# 海报图
小程序海报图可以使用Painter生成 
链接如下:https://github.com/Kujiale-Mobile/Painter
这是taro引入Painter的demo
https://github.com/Kujiale-Mobile/Taro-Painter-Demo