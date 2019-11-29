// pages/shareAddcommunity/getPhone/getPhone.js
import Protocol from "../../../modules/network/protocol";
import HiNavigator from "../../../navigator/hi-navigator";
import {Toast as toast, Toast, WXDialog} from "heheda-common-view";
import {getSocialGroupManager, whenDismissGroup} from "../../community/social-manager";
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log('options',options.sharedId)
      this.sharedId =options.sharedId
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
    async getPhoneNumber(e){
      const {detail: {encryptedData, iv, errMsg}} = e;
      if (errMsg === 'getPhoneNumber:ok') {
          try {
              let phoneNumber = await Protocol.getPhoneNum({encryptedData, iv});
              const {result: {groupId}} = await whenDismissGroup(Protocol.postGroupJoin({sharedId:this.sharedId,phone:phoneNumber}));
              if (groupId) {
                  getSocialGroupManager.currentSocial = {groupId};
                  if(e.currentTarget.dataset.type === 'firstEnter'){
                      getApp().globalData.firstEnter = this.data.isJoined;
                      getApp().globalData.isShareAddcommunity = true
                      HiNavigator.switchToCommunity();
                      return
                  }
                  HiNavigator.switchToCommunity();
              } else {
                  wx.showToast({
                      title: '抱歉,暂时无法加入该圈子',
                      icon: 'none',
                      duration: 3000
                  })
              }
          } catch (e) {
              console.error(e);
              wx.showToast({
                  title: '授权手机号失败，请重试',
                  icon: 'none',
                  duration: 1000,
              })
          } finally {

          }
      } else {

      }
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
