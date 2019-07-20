import Taro from '@tarojs/taro';
import React from '@taro'
import { View, Text, WebView, } from '@tarojs/components';
import util from '../../util';
import apiTool from '../../command/apiTool';

export default class OtherView extends Taro.Component {

  constructor(props) {
    super(props)
    this.init = false
    this.state = {
      url: util.tranUrl(this.$router.params)
    }
  }

  componentDidMount() {
    this.init = true  
  }

  componentDidShow() {
    const { viewName } = this.$router.params
    // 强制指定页面刷新
    if ([''].indexOf(viewName) !== -1 && this.init) {
      Taro.redirectTo({ url: `../../pages/otherView/index?viewName=${viewName}&` + util.tranParams(this.$router.params) })
    }
  }

  onMessage = ({ detail }) => {
    if (detail.data && detail.data.length > 0) {
      const data = detail.data.slice(-1)[0]
      if (data.type == 'share') {
        this.title = data.title
        this.path = data.path || 'pages/index/index?pavId=1'
        this.shareUrl = data.url
      } else if (data.type = 'temp') {
        const newTemp = Taro.getStorageSync('temp')
        if (newTemp) {
          const obj = JSON.parse(newTemp)
          Taro.setStorageSync('temp', JSON.stringify({ ...obj, [data.data.type]: data.data.data }))
        } else {
          Taro.setStorageSync('temp', JSON.stringify({ [data.data.type]: data.data.data }))
        }

      }
    }
  }

  onShareAppMessage(res) {
    return {
      title: this.title || '',
      path: this.path,
      imageUrl: this.shareUrl,
      success: function (res) {
        console.log('成功', res)
      }
    }
  }

  render() {
    // this.state.url + '&time' + this.state.time + '#wechat_redirect'
    return <WebView src={this.state.url} onMessage={this.onMessage} />
  }
}
