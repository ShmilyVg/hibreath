// pagesIndex/slimpleBox/slimpleBox.js
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
    console.log('options',options)
    const {result} = await Protocol.getMealInfo({foodId:options.foodId})
    this.setData({
      ...result,
      pageType:options.type
    })
    console.log('dataList',this.data.mealInfo)
  },
  goNextpage(e){
    const  tapIndex  = e.currentTarget.dataset.type;
    switch (tapIndex) {
      case 'diy':
        HiNavigator.navigateTorecommendation();
        break;
      case 'meau':
        HiNavigator.navigateToFoodRuler();
        break;
    }
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
