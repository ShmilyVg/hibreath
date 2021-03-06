// pages/memberManagement/memberManagement.js
/**
 * @Date: 2019-10-22 15:30:30
 * @LastEditors: 张浩玉
 */
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import {WXDialog} from "heheda-common-view";
import {getSocialGroupManager, judgeGroupEmpty, whenDismissGroup} from "../community/social-manager";
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
    const{result:{list,countMember,isMajor,sharedId,groupName,memberName}} = await whenDismissGroup(Protocol.postMembers({id:this.dataId}));
    this.setData({
        memberList:list,
        countMember:countMember,
        isMajor:isMajor,
        sharedId:sharedId,
        groupName:groupName,
        memberName:memberName
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
                    wx.showToast({
                        title: '移除成功',
                        duration: 1000,
                        image: '../../images/community/nike.png'
                    })
                    setTimeout(() => {
                        HiNavigator.switchToCommunity();
                    }, 1000);

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
      return {
          title: this.data.memberName+'邀请你加入['+this.data.groupName+']',
          path: '/pages/shareAddcommunity/shareAddcommunity?sharedId=' + this.data.sharedId,
          imageUrl:'https://backend.hipee.cn/hipee-resource/images/hibreath/20191104/95748a6a66c2aa77818764b93a693ea8.o6zajs-zth1ke_1mwkyso5jiadbc.plktmxj2ockf95748a6a66c2aa77818764b93a693ea8.png'
      };
  }
})
