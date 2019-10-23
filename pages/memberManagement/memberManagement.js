// pages/memberManagement/memberManagement.js
/**
 * @Date: 2019-10-22 15:30:30
 * @LastEditors: 张浩玉
 */
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import {WXDialog} from "heheda-common-view";
import {getSocialGroupManager, judgeGroupEmpty} from "../community/social-manager";
import {showActionSheet} from "../../view/view";
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
    this.dataId = options.dataId
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow () {
    const{result:{list,countMember,isMajor}} = await Protocol.postMembers({id:this.dataId});
    this.setData({
        memberList:list,
        countMember:countMember,
        isMajor:isMajor
    })
  },
      memberRemove(e){
      console.log(e,'e')
        WXDialog.showDialog({
            content: '确定要移除他吗\n' + '移除前请确保已和对方沟通过',
            showCancel: true,
            confirmText: "确定",
            cancelText: "取消",
            confirmEvent: () => {
                Protocol.postMembersDelete({groupId:Number(this.dataId),memberId:e.currentTarget.dataset.memberid}).then(data => {
                    getSocialGroupManager.currentSocial = {groupId:Number(this.dataId)};
                    HiNavigator.switchToCommunity();
                })
            },
            cancelEvent: () => {

            }
        });
    },
    async shareAdd() {
        try {
            const {tapIndex} = await showActionSheet({itemList: ['分享小程序邀请', '分享二维码邀请']});
            switch (tapIndex) {
                case 0:

                    break;
                case 1:

                    break;
            }
        } catch (e) {
            console.warn(e);
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
