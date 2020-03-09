// pages/sharedGuidance/sharedGuidance.js
import HiNavigator from "../../navigator/hi-navigator";
const app = getApp();
Page({

  data: {

  },

  onLoad: function (options) {
    this.setData({
      options
    })
  },

  onShow: function () {

  },
  goNextPage(){
    if (getApp().globalData.isLogin) {
      console.log('老用户')

    }else{
      console.log('新用户')
    }
    let sharedId = this.data.options.sharedId
    HiNavigator.switchToSetInfo(sharedId);
  }
  
})