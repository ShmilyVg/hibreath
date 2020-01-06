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
    nologin:true
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
   * @desc 跳转验证手机号群号
   */
  goVerification(){
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo'] &&!getApp().globalData.isLogin) {
          wx.showToast({
            title: '请先授权信息',
            duration: 1000,
            image: '../../images/loading_fail.png'
          })
        }else{
          HiNavigator.navigateToGoVerification()
        }
      }
    });
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})