/**
 * Using a custom _app.js with next-seo you can set default SEO
 * that will apply to every page. Full info on how the default works
 * can be found here: https://github.com/garmeeh/next-seo#default-seo-configuration
 */
import { Container } from "next/app";
import Head from "next/head";
import React from "react";
import "./app.less";
import apiTool from "../command/apiTool";
import BottomBar from "../components/BottomBar";

class AppComponent extends React.Component {
  getRouter = () => {
    const { router } = this.props;
    if (typeof window == "object") {
      if (window.location.search.indexOf("?") !== -1) {
        const obj = {};
        const searchArr = window.location.search.split("?")[1].split("&");
        searchArr.forEach((e, index) => {
          const splitArr = e.split("=");
          obj[splitArr[0]] = splitArr[1];
        });
        return obj;
      } else {
        return {};
      }
    } else {
      return router.query;
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isShow: false
      // isReady:true
    };
  }

  componentDidMount() {
    apiTool.getIsWxClient({
      fail: () => {
        this.setState({ isShow: true });
      }
    });

    fetch(`/getToken`, {
      method: "POST",
      body: location.href.split('#')[0],
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(e => e.json())
      .then(e => {
        const config = {
          debug: false,
          appId: e.appid,
          timestamp: e.timestamp,
          nonceStr: e.noncestr,
          signature: e.signature,
          jsApiList: [
            "chooseImage",
            "uploadImage",
            "previewImage",
            "checkJsApi",
            "translateVoice",
            "startRecord",
            "stopRecord",
            "translateVoice",
            "scanQRCode",
            "openCard"
          ] // 必填，需要使用的JS接口列表
        };
        wx.config(config);
        wx.error(function (res) {
          // alert(JSON.stringify(res));
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
      });

    // ${location.href.split('#')[0]}
    // getNewAccessTokenUsingPOST LoginController_MINIPROJECT
    //
    //  fetch(`/wechatApi/getToken?url=${location.href.split('#')[0]}`)
    // fetch(`/getToken?url=${location.href.split('#')[0]}`, {
    //   method: "GET",  
    // })
    //   .then(e => e.json())
    //   .then(e => {
    //     console.log('输出签名',e)
    //     const config = {
    //       debug:true,
    //       ...e.data,
    //       // appId: e.appId,
    //       // timestamp: e.timestamp,
    //       // nonceStr: e.nonceStr,
    //       // signature: e.signature,
    //       jsApiList: [
    //         "chooseImage",
    //         "uploadImage",
    //         "previewImage",
    //         "checkJsApi",
    //         "translateVoice",
    //         "startRecord",
    //         "stopRecord",
    //         "translateVoice",
    //         "scanQRCode",
    //         "openCard"
    //       ] // 必填，需要使用的JS接口列表
    //     };
    //     wx.config(config);
    //     wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
    //       wx.chooseImage({
    //         count: 1, // 默认9
    //         sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //         sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    //         success: function (res) {
    //           var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
    //         }
    //       });
    //     });
    //     wx.error(function(res) {
    //       console.log('输出错误',res)
    //       // alert(JSON.stringify(res));
    //       // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    //     });
    //   });
  }

  componentWillUnmount() {
    console.log("总页面销毁");
  }

  render() {
    const { Component, pageProps, ...arg } = this.props;
    const { isShow } = this.state;
    return (
      <Container>
        <Head>
          <script src={"https://res.wx.qq.com/open/js/jweixin-1.4.0.js"} />
          <meta
            name="viewport"
            content="width=device-width,height=device-height,initial-scale=1,maximum-scale=1, minimum-scale=1"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="browsermode" content="application" />
          <meta name="full-screen" content="true" />
          <meta name="x5-fullscreen" content="true" />
          <meta name="360-fullscreen" content="true" />
        </Head>
        {/* {isShow &&
          ["/", "/index", "/classify", "/my"].indexOf(
            this.props.router.route
          ) == -1 && <HeaderTitle />} */}
        <Component {...pageProps} {...arg} routerParams={this.getRouter(arg)} />
        {isShow &&
          ["/", "/index", "/classify", "/my"].indexOf(
            this.props.router.route
          ) !== -1 && <BottomBar url={this.props.router.route} />}
      </Container>
    );
  }
}
export default AppComponent;
