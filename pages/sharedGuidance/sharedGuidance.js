// pages/sharedGuidance/sharedGuidance.js
import HiNavigator from "../../navigator/hi-navigator";
import * as tools from "../../utils/tools";
const ImageSource = require('../../utils/ImageSource.js');
const ImageLoader = require('../../utils/ImageLoader.js')
const app = getApp();
Page({

  data: {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    needImgList:[]
  },

  onLoad: function (options) {
    let sharedId = options.sharedId;
    wx.setStorageSync('sharedId', sharedId);

  },

  onShow: function () {
  },
  getImages(){
    var loader = new ImageLoader({
      base: ImageSource.BASE,
      source: this.data.needImgList,
      loaded: res => {
        setTimeout(() => {
          this.setData({
            showWindows: true
          })
        }, 300)
      }
    });
  },
  goNextPage() {
    if (getApp().globalData.isLogin) {
      console.log('老用户')

    } else {
      console.log('新用户')
    }

    HiNavigator.switchToSetInfo();
  }

})