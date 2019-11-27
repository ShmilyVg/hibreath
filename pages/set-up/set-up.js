// pages/set-up/set-up.js
import HiNavigator from "../../navigator/hi-navigator";
import { showActionSheet } from "../../view/view";
import { WXDialog } from "heheda-common-view";
import Protocol from "../../modules/network/protocol";
import {
  getGroupDynamicManager,
  getSocialGroupManager,
  getSocialGroupMembersViewInfo,
  judgeGroupEmpty,
  whenDismissGroup
} from "../community/social-manager.js";
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
    this.setData({
      socialMemberInfo: JSON.parse(options.socialMemberInfo),
      currentSocial: JSON.parse(options.currentSocial) 
    })
    console.log("currentSocial", this.data.currentSocial)
   
    //console.log("socialMemberInfo", this.data.socialMemberInfo.name, this.data.socialMemberInfo.name)
    
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

  },
  async updata() {
    await whenDismissGroup(Protocol.postMemberGroupExit({ ...(await judgeGroupEmpty()) }));
  
  },
 
  
  deleteCircle: function(){
           WXDialog.showDialog({
              content: '确定要删除该圈子吗\n' + '删除后记录无法找回 慎重操作',
              showCancel: true,
              confirmText: "确定",
              cancelText: "取消",
              confirmEvent: () => {
                  wx.clearStorageSync('currentSocialGroupId')
                this.updata()
                  HiNavigator.switchToCommunity();
              },
              cancelEvent: () => {

              }
            });
         
  },
  signOut:function(){
    wx.setStorageSync('currentSocialGroupId', "");
    HiNavigator.switchToCommunity();

  },
  onRename: function () {
    
    // this.setData({
    //   groupId  : wx.getStorageSync('currentSocialGroupId')
    // })
    
    HiNavigator.navigateToRename({ memberName: this.data.socialMemberInfo.memberName });
   
  },
  async modifyingData(){
    this.setData({
      groupId  : wx.getStorageSync('currentSocialGroupId')
    })
    HiNavigator.navigateToChangeCommunity({ groupId: this.data.groupId, name: this.data.currentSocial.name, imgUrl: this.data.currentSocial.imgUrl});
  }


})