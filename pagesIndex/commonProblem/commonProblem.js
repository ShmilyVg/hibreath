// pagesIndex/commonProblem/commonProblem.js
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  toSubList:function(e){
    console.log(e)
    this.data.id = e.currentTarget.dataset.id;
    console.log( this.data.id )
    HiNavigator.navigateToSubList({id:this.data.id,title:e.currentTarget.dataset.title});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onSettingsHelp()
  },
  async onSettingsHelp() {
    const { result } = await Protocol.getSettingsHelp({id:''});
    this.setData({
      list: result.list
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
