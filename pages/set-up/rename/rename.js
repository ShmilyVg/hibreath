// pages/set-up/rename/rename.js
import HiNavigator from "../../../navigator/hi-navigator";
import Protocol from "../../../modules/network/protocol";
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
      console.log(options)
      this.setData({ 
        name: options.name
      })
  },
  bindInputName(e) {
   
    this.setData({
      memberName: e.detail.value
    })
    console.log('e.detail.value', e.detail.value)

    if (this.data.memberName == "") {
      //如果不为空，就返回true.
      this.setData({
        userIdCardNameif: false
      });
      
    } else {
      this.setData({
        userIdCardNameif: true
      });
     
    }

  },
  materialsBtn:function(){
    // console.log(this.data.name)
    let groupId = (wx.getStorageSync('currentSocialGroupId') || "");
    this.setData({
      groupId: groupId
    })
    
    // if (this.data.name !== "") {     
    //   HiNavigator.switchToCommunity();
     
    // } 
    console.log(this.data.memberName, this.data.name, this.data.groupId)
    Protocol.postUpdataMember({ name: this.data.memberName, groupId: this.data.groupId }).then(data => {
      HiNavigator.switchToCommunity();

    });
 
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