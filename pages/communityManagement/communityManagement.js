// pages/communityManagement/communityManagement.js
/**
 * @Date: 2019-10-22 17:30:00
 * @LastEditors: 张浩玉
 */
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";
import {getSocialGroupManager} from "../community/social-manager";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[{
          name: "圈子圈子圈子圈子圈子圈子圈子圈子圈子圈子",
          headUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLyEWO2T2BrgxhJdUcJgOWdvCdFDyG6831ROLzqW8DxAvM5ibPvHnY18S18JXib0qWZVbicxKrxg1lmQ/132",
          isMajor: true,
          countMember:10
      },
          {
              name: "圈子圈子圈子圈子圈子圈子圈子",
              headUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLyEWO2T2BrgxhJdUcJgOWdvCdFDyG6831ROLzqW8DxAvM5ibPvHnY18S18JXib0qWZVbicxKrxg1lmQ/132",
              isMajor: false,
              countMember:5
          },{
              name: "圈子3",
              headUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLyEWO2T2BrgxhJdUcJgOWdvCdFDyG6831ROLzqW8DxAvM5ibPvHnY18S18JXib0qWZVbicxKrxg1lmQ/132",
              isMajor: false,
              countMember:9
          }
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
      const{result:{list}} = await Protocol.getMygroup()
      this.setData({
          groupList:list
      })
  },
  createCommunityBtn(){
      HiNavigator.navigateToCreateCommunity()
  },
  toCommunity(e){
      getSocialGroupManager.currentSocial = {groupId:e.currentTarget.dataset.id};
      HiNavigator.switchToCommunity();
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
