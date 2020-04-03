// pagesThree/help-cards/help-cards.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import Login from "../../modules/network/login";

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
    const {result} = await Protocol.getTaskInfoBySharedId({sharedId:options.sharedId,sharedType:"newcomer"});
    this.setData({
      ...result,
      sharedId:options.sharedId
    })
    console.log(' getApp().globalData.isLogin', getApp().globalData.isLogin)
    if(!this.data.isComplete && !getApp().globalData.isLogin){
      this.setData({
        btnText:'进入Slimple，帮ta补卡',
        todo:"toRegisterHelp"
      })
    }
    if(this.data.isComplete && !getApp().globalData.isLogin){
      this.setData({
        btnText:'补卡已结束,进入我的Slimple',
        todo:"toRegister"
      })
    }
    if(this.data.isComplete && getApp().globalData.isLogin){
      this.setData({
        btnText:'进入我的Slimple',
        todo:"toSetInfo"
      })
    }
  },
  //单纯注册
  async toRegister(e){
    const { detail: { userInfo, encryptedData, iv } } = e;
    console.log(userInfo)
    if (!!userInfo) {
      await Login.doRegister({ userInfo, encryptedData, iv });
      setTimeout(() => {
        HiNavigator.switchToSetInfo()
      }, 500);
    }
  },
  //注册并帮助打卡
  async toRegisterHelp(e){
    const { detail: { userInfo, encryptedData, iv } } = e;
    console.log(userInfo)
    if (!!userInfo) {
      await Login.doRegister({ userInfo, encryptedData, iv });
      let sharedId = this.data.sharedId
      //此处需要处理不授权的情况
      let postData = {
        "sharedId": sharedId //分享用户编号
      }
      let { result } = await Protocol.putBreathSign(postData);
      if (result.status){
        wx.showToast({
          title: '帮好友补签成功',
          duration: 500
        });
      }
      setTimeout(() => {
        HiNavigator.switchToSetInfo()
      }, 500);
    }
  },
  //老用户直接进入小程序
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