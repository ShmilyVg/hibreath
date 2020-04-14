// pagesThree/supervise/supervise.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import Login from "../../modules/network/login";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const {result} = await Protocol.getTaskInfoBySharedId({sharedId:options.sharedId,sharedType:"initialHeart"});
    console.log('result',result)
    setTimeout(()=>{
      this.setData({
        needImg:result.sharePoster.toGroup.url,
        isLogin:getApp().globalData.isLogin
      })
    },500)

  },
  async toNextpage(e){
      const { detail: { userInfo, encryptedData, iv } } = e;
      console.log(userInfo)
      if (!!userInfo) {
        await Login.doRegister({ userInfo, encryptedData, iv });
        setTimeout(() => {
          HiNavigator.switchToSetInfo()
        }, 500);
      }

  },
  toSetInfo(){
    HiNavigator.switchToSetInfo()
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