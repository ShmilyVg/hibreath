// pages/caseDetails/caseDetails.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIndex: 1,
    index:0,
    radiusHeader: "day-list-header",
    fatReduction:"",
    schemaId:"4"
  },
  ifShow: function(e) {
    if (e.currentTarget.dataset.index != this.data.showIndex) {
      this.setData({
        showIndex: e.currentTarget.dataset.index,
        radiusHeader: "day-list-header"
      })
    } else {
      this.setData({
        showIndex: 0, 
        radiusHeader: "day-list-header-radius"
      })
        

    }
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.onfatReduction();
  
  },
  
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  async onfatReduction() {
    console.log(1111);

    const fatReduction = await Protocol.fatReducingScheme({ schemaId: this.data.schemaId});
    console.log(1111, data)
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