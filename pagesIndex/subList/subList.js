// pagesIndex/substituteMeal/substituteMeal.js
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
      id:options.id
    });
    console.log(this.data.id);
    this.onSettingsHelp();
  },
  async onSettingsHelp() {
    console.log(this.data.id)
   const { result } = await Protocol.getSettingsHelp({id:this.data.id});
    this.setData({
      list: result.list
    })
    console.log(this.data.list)
  },
  toDetailsList:function(e){
    console.log(e);
    this.data.index= e.currentTarget.dataset.index;
    HiNavigator.navigateToDetailsList({reason:this.data.list[this.data.index].reason,title:this.data.list[this.data.index].title,solution:this.data.list[this.data.index].solution});
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