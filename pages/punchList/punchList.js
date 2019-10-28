// pages/punchList/punchList.js
import {getLatestOneWeekTimestamp} from "../../utils/time";
import Protocol from "../../modules/network/protocol";
/**
 * @Date: 2019-10-25 10:20:53
 * @LastEditors: 张浩玉
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
      currenttab: '0',
  },
    //切换标签页
    async selectTab(e) {
        let newtab = e.currentTarget.dataset.tabid;
        if (this.data.currenttab !== newtab) {
            this.setData({
                currenttab: newtab
            });
            if (newtab == 0) {
                const{result:{ranklist}}=await Protocol.postAddup();
                this.setData({
                    ranklist:ranklist
                })
            }else{
                const{result:{ranklist}}=await Protocol.postContinual();
                this.setData({
                    ranklist:ranklist
                })
            }
        }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
        const{result:{nickname,headUrl,rankNum,addup,continual,ranklist}}=await Protocol.postAddup();
        this.setData({
            nickname:nickname,
            headUrl:headUrl,
            rankNum:rankNum,
            addup:addup,
            continual:continual,
            ranklist:ranklist
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
  onShow(){

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
      return{
          title: this.data.memberName+'邀请你加入'+this.data.groupName,
          path: '/pages/punchList/punchList?sharedId=' + this.data.sharedId
      }

  }
})
