// pages/low-carbon/low-carbon.js
import {getLatestOneWeekTimestamp} from "../../utils/time";
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currenttab: 'howEatBox',
  },
  //切换标签页
  async selectTab(e) {
    let newtab = e.currentTarget.dataset.tabid;
    console.log(newtab)
    if (this.data.currenttab !== newtab) {
      this.setData({
        currenttab: newtab
      });
      console.log('currenttab',this.data.currenttab)
    }
  },
  toRecomTarNew(){
    HiNavigator.navigateToRecomTarNew()
  },
  toSetInfo(){
    HiNavigator.switchToSetInfo()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    
    const {result} = await Protocol.getLossfatCourse()
    this.setData({
      result:result
    })
    console.log('result',this.data.result.howEatAdditionaObj[0].foodList)
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