// pages/sharedGuidance/sharedGuidance.js
import HiNavigator from "../../navigator/hi-navigator";
import * as tools from "../../utils/tools";
const ImageSource = require('../../utils/ImageSource.js');
const ImageLoader = require('../../utils/ImageLoader.js')
const app = getApp();
Page({

  data: {
    needImgList: ['shareGuide-1.png', 'shareGuide-2.png']
  },

  onLoad: function (options) {
    this.getImages();
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