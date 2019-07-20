const Koa = require('koa');
const app = new Koa();
const axios = require('axios').default
const crypto = require('crypto')
// 响应
app.use(async(ctx, next) => {
    if (ctx.request.path === '/getToken') {
        console.log('请求进入')
        const data = await getWechat(ctx.query.url)
        ctx.response.body = { code: 200, data }
    } else {
        await next();
    }
});

function sha1(str) {
    let shasum = crypto.createHash("sha1")
    shasum.update(str)
    str = shasum.digest("hex")
    return str
}

/**
 * 生成签名的时间戳
 * @return {字符串} 
 */
function createTimestamp() {
    return parseInt(new Date().getTime() / 1000) + ''
}

/**
 * 生成签名的随机串
 * @return {字符串} 
 */
function createNonceStr() {
    return Math.random().toString(36).substr(2, 15)
}

/**
 * 对参数对象进行字典排序
 * @param {对象} args 签名所需参数对象
 * @return {字符串}  排序后生成字符串
 */
function raw(args) {
    var keys = Object.keys(args)
    keys = keys.sort()
    var newArgs = {}
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key]
    })

    var string = ''
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k]
    }
    string = string.substr(1)
    return string
}

/**
* @synopsis 签名算法 
*
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
*
* @returns {对象} 返回微信jssdk所需参数对象
*/
function sign(jsapi_ticket, url) {
    var ret = {
        jsapi_ticket: jsapi_ticket,
        nonceStr: createNonceStr(),
        timestamp: createTimestamp(),
        url: url
    }
    var string = raw(ret)
    ret.signature = sha1(string)
    ret.appId = 'wxfbcf93a6f4205024'
    console.log('输出结果', JSON.stringify(ret))
    return ret
}

const getWechat = (url) =>{
    return new Promise((resolve, reject) => {
        let access_token = ''
        axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxfbcf93a6f4205024&secret=c686bc8a9ef6566fe2d1a33771d41c42')
        .then((e) => {         
            access_token = e.data.access_token
            console.log('输出token', access_token)
            axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`)
            .then((el)=>{
                console.log('输出ticket', el.data.ticket)
                resolve(sign(el.data.ticket, url))
            })
        })
    });
}

app.listen(3001);