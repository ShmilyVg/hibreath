import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";

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
      subId:options.id,
      title:options.title
    });
    console.log(this.data.title);
    this.onSettingsHelp();
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },
  async onSettingsHelp() {
    console.log(this.data.subId)
    const { result } = await Protocol.getSettingsHelp({id:this.data.subId});
    this.setData({
      list: result.list
    })
    console.log(this.data.list)
  },
  toDetailsList:function(e){
    console.log(e);


    HiNavigator.navigateToDetailsList({detailsid:e.currentTarget.dataset.id,pageTitle:this.data.title});
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
