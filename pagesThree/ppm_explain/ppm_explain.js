// pagesThree/ppm_explain/ppm_explain.js
import HiNavigator from "../../navigator/hi-navigator";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    speed_tip: [{
      text: '未燃脂',
      range: '0-2'
    }, {
      text: '稳步燃脂',
      range: '3-9'
    }, {
      text: '状态极佳',
      range: '10-19'
    }, {
      text: '快速燃脂',
      range: '20-39'
    }, {
      text: '过度燃脂',
      range: '40-99'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goback() {
    HiNavigator.navigateBack({ delta: 1 });
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