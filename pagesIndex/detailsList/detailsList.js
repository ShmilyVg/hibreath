// pagesIndex/substituteMeal/substituteMeal.js
import Protocol from "../../modules/network/protocol";

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
      detailsid:options.detailsid,
      pageTitle:options.pageTitle
    });
    console.log(this.data.detailsid);
    this.onSettingsHelp();
    wx.setNavigationBarTitle({
      title: this.data.pageTitle
    })
  },
  async onSettingsHelp() {
    console.log(this.data.detailsid)
    const { result } = await Protocol.getSettingsHelpInfo({id:this.data.detailsid});
    this.setData({
      title:result.title,
      list: result.list
    })
    console.log(this.data.list)
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