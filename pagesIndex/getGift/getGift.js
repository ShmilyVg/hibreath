// pagesIndex/getGift/getGift.js
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
  async onLoad(options) {
    let finishedPhone = options.finishedPhone;
    const {result} = await Protocol.getGift({couponId: options.couponId})
    this.setData({
      finishedPhone,
      ...result
    })
    console.log('ree',result)
  },
  //复制文字
  copyBtn(){
    wx.setClipboardData({
      data: this.data.fetchCode,
      success(res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  goToClub(){
    HiNavigator.navigateToGoVerification()
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