import React, { Component } from 'react'
import styles from './index.less'
import OvervaluePurchase from '../../components/OvervaluePurchase';
import apiTool from '../../command/apiTool';
import createDva from '../../command/createDva'
import Voucher from '../../components/Voucher'
import ProductPrice from '../../components/ProductPrice'
import api from '../../command/api';
import { Toast, PullToRefresh } from 'antd-mobile';
import LoadingComponent from '../../components/LoadComponent';
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
import SwiperHome from '../../components/SwiperHome/index';
import dynamic from 'next/dynamic'
import Main from '../../components/Main';
const DynamicMain = dynamic(import('../../components/Main'), { ssr: false })
@createDva(['Home'])
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      height: 400
    };
  }

  componentDidMount() {
    this.initNetData()
    this.initSwiper();
    apiTool.postMessage()
  }

  componentWillUnmount() {
    console.log('生命周期销毁')
  }
  
  initNetData = () => {
    const { pavId } = apiTool.getRouterParams(this);
    apiTool.postMessage()
    apiTool.updateTitle('八鲜溯源优品')
    apiTool.send(this, [
      // 品牌馆信息
      api
        .FirmMallPavController_MINIPROJECT("Home")
        .getfrimMallPavInfoUsingPOST({ id: pavId })({
          tranData: ({ data }) => {
            return { detail: data };
          },
          onError: () => {
            return { detail: {} };
          }
        }),
      // 广告
      api
        .IndexController_MINIPROJECT("Home")
        .topManagerUsingPOST({ id: pavId })({
          tranData: ({ data }) => {
            return { swiperData: data };
          },
          onError: () => {
            return { swiperData: [] };
          }
        }),
      api.IndexController_MINIPROJECT().pavListUsingPOST()(),
      // 新人劵
      api
        .IndexController_MINIPROJECT("Home")
        .newPeopleVoucherUsingPOST({ pavId })({
          tranData: ({ data }) => {
            return { newPeople: data };
          },
          onError: () => {
            return { newPeople: {} };
          }
        }),
      // 活动
      api.IndexController_MINIPROJECT("Home").activityUsingPOST({ pavId })({
        tranData: ({ data }) => {
          return { activity: data };
        },
        onError: () => {
          return { activity: [] };
        }
      }),
      // 图标组
      api.IndexController_MINIPROJECT("Home").iconListUsingPOST({ id: pavId })({
        tranData: ({ data }) => {
          return { iconGroup: data };
        },
        onError: () => {
          return { iconGroup: [] };
        }
      }),
      // 楼层
      api.IndexController_MINIPROJECT("Home").floorUsingPOST({ pavId })({
        tranData: ({ data }) => {
          return { floor: data };
        },
        onError: () => {
          return { floor: [] };
        }
      })
    ]);
  }

  initSwiper = () => {
    var mySwiper = new Swiper(".swiper-container", {
      width: window.innerWidth,
      height: 740,
      autoHeight: true,
      autoplay: true,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        type: "fraction"
      }
    });
  };

  onHeaderClick = () => {
    const { pavId } = apiTool.getRouterParams(this);
    apiTool.jumpNativeRouter("guanDetail", { pavId });
  };

  onSearchDown = () => {
    apiTool.jumpRouter("searchHistory");
  };

  onVoucher = data => {
    // type 0 通用 1 新人
    let obj = {
      money: data.totalMoney,
      type: 0,
      date: data.expireNum,
      id: data.id
    };
    apiTool.setValue(this, "Home", { showVoucher: true, voucherData: obj });
  };

  onHref = ({ id }) => {
    const { pavId } = apiTool.getRouterParams(this);
    apiTool.send(this, [
      api
        .IndexController_MINIPROJECT()
        .addVoucherReceiveUsingPOST({ vouId: id, pavId })({
          onCallBack: () => {
            apiTool.setValue(this, "Home", { showVoucher: false });
            Toast.show("领取成功");
          },
          onError: ({ retData }) => {
            apiTool.setValue(this, "Home", { showVoucher: false });
            if (retData.msg == "success") {
              Toast.show('领取成功')
            } else {
              Toast.show(retData.msg)
            }
            if (retData.status == 401) {
              apiTool.jumpLogin();
            }
          }
        })
    ]);
  };

  onClose = () => {
    apiTool.setValue(this, "Home", { showVoucher: false });
  };

  renderHeaderSearch = () => {
    const { detail } = this.props;
    return (
      <div className={styles.headerSearch}>
        <div className={styles.headerSearchLeft}>
          {detail.pavLogo && <img src={detail.pavLogo} className={styles.headerSearchLogo} />}
          <div
            onClick={this.onHeaderClick}
            style={{ display: "flex", alignItems: "center", marginLeft: 10 }}
          >
            <div
              style={{
                fontSize: apiTool.getSize(32),
                color: "#333333",
                fontWeight: "bold"
              }}
            >
              {detail.pavName}
            </div>
            <img
              src={require("../../images/My/jiantou.png")}
              style={{ marginLeft: 10, width: "4.2vw", height: "4.2vw" }}
            />
          </div>
        </div>
        <div className={styles.headerSearchRight} onClick={this.onSearchDown}>
          <img src={require("../../images/My/search.png")} />
          <div>搜索</div>
        </div>
      </div>
    );
  };

  renderHeaderBanner = () => {
    const { swiperData = [] } = this.props;
    if (swiperData.length == 0) return null;
    return <SwiperHome data={swiperData} />;
  };

  onIconDown = item => {
    const { pavId } = apiTool.getRouterParams(this);
    if (item.url == '/' || item.url == '#') return
    if (/(http|https):\/\/([\w.]+\/?)\S*/.test(item.url)) {
      apiTool.jumpNativeRouter("latticeHref", { url: item.url });
    } else if (item.url.indexOf('classify') > -1) {
      const param = item.url.split("?")[1];
      const select = param.split("=")[1];
      apiTool.jumpRouter("classify", { pavId, select });
    } else if (item.url.indexOf('shopDetail') > -1) {
      const param = item.url.split("?")[1];
      const id = param.split("=")[1];
      apiTool.jumpRouter("shopDetail", { pavId, id });
    } else {
      apiTool.jumpRouter(item.url, { pavId });
    }
  };
  renderHeaderIconGroup = () => {
    const { iconGroup = [] } = this.props;
    return (
      <div className={styles.headerIconGroup}>
        {iconGroup.map((e, i) => {
          return (
            <div
              key={i}
              className={styles.headerIconItem}
              onClick={() => this.onIconDown(e)}
            >
              <img src={e.img} />
              <div>{e.title}</div>
            </div>
          );
        })}
      </div>
    );
  };

  renderHeader = () => {
    return (
      <div className={styles.header}>
        {/* 顶部搜索*/}
        {this.renderHeaderSearch()}
        {/* 显示banner */}
        {this.renderHeaderBanner()}
        {/* 顶部九宫格 */}
        {this.renderHeaderIconGroup()}
      </div>
    );
  };

  renderHongBao = data => {
    return (
      <div className={styles.hongbao} onClick={() => this.onVoucher(data)}>
        <img
          src={
            data.img +
            "?imageMogr2/thumbnail/!690x140r/format/jpg/blur/1x0/quality/75"
          }
        />
      </div>
    );
  };

  onScrollGroupItemDown = item => {
    const { pavId } = apiTool.getRouterParams(this);
    apiTool.jumpRouter("productDetails", {
      id: item.proId,
      skuId: item.skuId,
      pavId
    });
  };

  renderFloorGroup = (item, index) => {
    return (
      <div className={styles.floorGroupView} key={index}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            onClick={() => this.onIconDown(item)}
            src={
              item.img.split(",")[0] +
              "?imageMogr2/auto-orient/thumbnail/690x/format/jpg/blur/1x0/quality/75"
            }
            style={{
              width: "100%",
              height: apiTool.getSize(220),
              backgroundSize: "contain",
              borderRadius: apiTool.getSize(20)
            }}
          />
        </div>
        {/* 楼层图片 */}
        <div className={styles.scroll}>
          {item.pro.slice(0, 3).map((e, i) => {
            return (
              <ProductPrice
                style={{ marginRight: 0 }}
                data={e}
                key={i}
                onClick={() => this.onScrollGroupItemDown(e)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  onLoginDown = () => {
    wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        }
      });
    });
  };

  renderFloorView = () => {
    const { floor = [] } = this.props;
    return (
      <div style={{ display: "flex", flexDirection: "column", background: '#f8f8f8' }}>
        {floor.map((e, i) => {
          return this.renderFloorGroup(e, i)
        })}
      </div>
    );
  };

  onMoreClick = () => {
    const { pavId } = apiTool.getRouterParams(this);
    apiTool.jumpRouter("classify", { pavId, });
  };

  onItemClick = item => {
    const { pavId } = apiTool.getRouterParams(this);
    apiTool.jumpRouter("productDetails", {
      id: item.id,
      skuId: item.skuId,
      pavId
    });
  };

  getData = () => {
    alert(localStorage.getItem("session_key"));
    alert(localStorage.getItem("userId"));
  };

  renderView = () => {
    const {
      showVoucher = false,
      voucherData = {},
      activity,
      newPeople
    } = this.props;
    return (
      <DynamicMain
        isScroll={true}
        style={{ background: "#f8f8f8", }}
        onDown={this.initNetData}
        other={() => {
          return showVoucher && (
            <Voucher
              {...voucherData}
              onClick={this.onHref}
              onClose={this.onClose}
            />
          )
        }}
      >
        {this.renderHeader()}
        {/* 红包 */}
        {newPeople && newPeople.img && this.renderHongBao(newPeople)}
        {/* 活动 */}
        {activity && activity.length > 0 && (
          <OvervaluePurchase
            data={activity}
            onMoreClick={this.onMoreClick}
            onItemClick={this.onItemClick}
          />
        )}
        {/* 楼层组 */}
        {this.renderFloorView()}
        <div style={{ height: apiTool.getSize(30), width: "100%" }} />
      </DynamicMain>
    );
  };

  render() {
    const { isShow } = this.props;
    return <LoadingComponent isShow={isShow} renderView={this.renderView} />;
  }
}
