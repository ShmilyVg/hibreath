// pages/set-up/rename/rename.js
import HiNavigator from "../../../navigator/hi-navigator";
import Protocol from "../../../modules/network/protocol";
import * as tools from "../../../utils/tools";
import {whenDismissGroup} from "../../community/social-manager";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      disable:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options)
      this.setData({
        name: options.name
      })
  },
  bindInputName(e) {
     //wxml 需要设置value 不然不能过滤表情
    this.setData({
      memberName: tools.filterEmoji(e.detail.value)
    })
    console.log('过滤表情value', e.detail.value)
      this.setData({
          disable: !(this.data.memberName.match(/^\s*$/) == null)
      })

  },
  async materialsBtn(){
    let groupId = (wx.getStorageSync('currentSocialGroupId') || "");
    this.setData({
      groupId: groupId
    })
    await whenDismissGroup(Protocol.postUpdataMember({ name: this.data.memberName, groupId: this.data.groupId }));
    HiNavigator.switchToCommunity();
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
