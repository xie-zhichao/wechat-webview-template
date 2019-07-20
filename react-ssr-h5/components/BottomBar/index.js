import React, { Component } from 'react'
import styles from './index.less'
import Router from 'next/router';
import apiTool from '../../command/apiTool';

export default class BottomBar extends Component {

  onTabBarDown = (key) => {
    if (key == 'class') {
        Router.push('/classify/?pavId=1')
    }else {
        Router.push( '/' + key + '/?pavId=1')
    }
  }  

  render() {
    const {url} = this.props
    const data = [
        {
            name:'首页',
            key:'index',
            isFocus:url == '/' || url == '/index'
        },
        {
            name:'分类',
            key:'class',
            isFocus: url == '/classify'
        },
        {
            name:'扫描',
            key:'scan',
            isFocus:url == '/scan'
        },
        {
            name:'我的',
            key:'my',
            isFocus: url == '/my'
        }
    ]
    return (
      <div className={styles.main}>
        {
            data.map((e,i)=>{
                return (
                    <div key={i} className={styles.tabBarItem} onClick={()=>this.onTabBarDown(e.key)}>
                       <img src={require(`../../images/TarBar/${e.key}${e.isFocus?'Select':'Normal'}.png`)}/> 
                       <div style={{fontSize:apiTool.getSize(20)}}>{e.name}</div>
                    </div>
                )
            })
        }
      </div>
    )
  }
}
