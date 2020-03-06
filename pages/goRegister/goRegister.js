// pages/goRegister/goRegister.js
import HiNavigator from "../../navigator/hi-navigator";
import {Toast} from "heheda-common-view";
import Login from "../../modules/network/login";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nologin:true,
    curDot:0,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(()=>{
      if(getApp().globalData.isLogin) {
        this.setData({
          nologin:false
        })
      }else{
        this.setData({
          nologin:true
        })
      }
    },800)
  },

  /**
   * @desc 注册
   */
  async onGetUserInfoEvent(e) {
    const {detail: {userInfo, encryptedData, iv}} = e;
    if (!!userInfo) {
      Toast.showLoading();
      await Login.doRegister({userInfo, encryptedData, iv});
      this.setData({
        nologin:false
      })
      Toast.hiddenLoading();
      setTimeout(() => {
        wx.showToast({
          title: '注册成功',
          duration: 2000
        });
      });
      Toast.hiddenLoading();
    }
  },
  onShow: function () {
  },

})
