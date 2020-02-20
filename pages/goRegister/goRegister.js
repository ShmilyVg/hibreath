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

  changeCur(){
    let curDot = this.data.curDot;
    if (curDot){
      this.setData({
        curDot: 0
      })
      this.shrink.scale(0.9).opacity(0.8).left('-410rpx').step()
      this.magnify.scale(1).opacity(1).left('170rpx').step()
    }else{
      this.setData({
        curDot: 1
      })
      this.shrink.scale(1).opacity(1).left('50rpx').step()
      this.magnify.scale(0.9).opacity(0.8).left('630rpx').step()
    }
    this.setData({
      shrink: this.shrink.export(),
      magnify: this.magnify.export()
    })
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
  handEnd(e){
    let touchend = e.changedTouches[0].clientX;
    let touchstart = this.data.touchstart;
    if (this.data.curDot){
      if (touchend < touchstart){
        this.changeCur()
      }
    }else{
      if (touchend > touchstart) {
        this.changeCur()
      }
    }
    
  },
  handStart(e){
    this.setData({
      touchstart: e.changedTouches[0].clientX
    })
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
    this.shrink = wx.createAnimation();
    this.magnify = wx.createAnimation()
    this.changeCur()
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
