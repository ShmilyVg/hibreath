// pages/caseDetails/caseDetails.js
import Protocol from "../../modules/network/protocol";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIndex: 1,
    radiusHeader: ["day-list-header", "day-list-header", "day-list-header", "day-list-header"],
    schemaId:"",
    selectedFlag: [false, false, false, false],
    ifAddFood:true
  },
  ifShow: function(e) {
    var index = e.currentTarget.dataset.index;
 
    if (this.data.selectedFlag[index]) {
      this.data.selectedFlag[index] = false;
      this.data.radiusHeader[index] = "day-list-header";
      
    } else {
      this.data.selectedFlag[index] = true;
      this.data.radiusHeader[index] = "day-list-header-radius";
      console.log(this.data.radiusHeader[index])
     
    }
    console.log(this.data.selectedFlag[index])
    this.setData({
      selectedFlag: this.data.selectedFlag,
      radiusHeader: this.data.radiusHeader,
    })
    console.log(this.data.selectedFlag)
  

  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      schemaId: options.schemaId
    })
    this.onfatReduction();
  },
 
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },
  async onfatReduction() {
    const { result } = await Protocol.fatReducingScheme({ schemaId: this.data.schemaId});
  
    this.setData({
      title: result.title,
      dayList: result.dayList,
      loseHot: result.loseHot,
      loseSugar: result.loseSugar,
      noticeList: result.noticeList,
     
    })


    //console.log(123, this.data.dayList)
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