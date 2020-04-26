// pagesIndex/coupon/coupon.js
import Protocol from "../../modules/network/protocol";
import {Toast} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currenttab:'noUsed',
    pageIndex:1,
    pageSub:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const {result} = await Protocol.getCouponListPage({isUsed:0,page:this.data.pageIndex})
    this.setData({
      resultIndex:result
    })
    this.data.pageIndex++;
    console.log('result',this.data.resultIndex)
  },
  //切换标签页
  async selectTab(e) {
    console.log('ee',e)
    let newtab = e.currentTarget.dataset.tabid;
    console.log(newtab)
    if (this.data.currenttab !== newtab) {
      this.setData({
        currenttab: newtab
      });
    }
    if(this.data.currenttab == 'noUsed'){
      const {result} = await Protocol.getCouponListPage({isUsed:0,page:1})
      if (result.length>0) {
        this.setData({ resultIndex: result});
      }
    }
    if(this.data.currenttab == 'isExpired'){
      const {result} = await Protocol.getCouponListPage({isExpired:1,page:1})
      if (result.length>0) {
        this.setData({ resultSub: result});
        this.data.pageSub++;
      }
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
  toGift(e){
    let item = e.currentTarget.dataset.item
    
    if (item.platform == 'youzan'){
      wx.showToast({
        title: '即将跳转有赞小程序',
        icon: 'none',
        duration: 3000
      });
      let mpAppId = item.mpAppId;
      let mpPath = item.mpPath;
      setTimeout(() => {
        //跳转有赞小程序
        wx.navigateToMiniProgram({
          appId: mpAppId,
          path: mpPath,
          extraData: {
            // foo: 'bar'
          },
          envVersion: 'develop',
          success: (res) => {
            // 打开成功
            console.log('打开有赞小程序成功', res);
          }
        })
      }, 1000)
    }else{
      HiNavigator.navigateToGetGift({ id: item.id })
    }
    
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    if(this.data.currenttab == 'noUsed'){
      Toast.showLoading();
      const {result} = await Protocol.getCouponListPage({isUsed:0,page:this.data.pageIndex})
      if (result.length>0) {
        this.data.pageIndex++;
        this.setData({ resultIndex: this.data.resultIndex.concat(result)});
      }
      Toast.hiddenLoading();
    }
    if(this.data.currenttab == 'isExpired'){
      Toast.showLoading();
      const {result} = await Protocol.getCouponListPage({isExpired:1,page:this.data.pageSub})
      if (result.length>0) {
        this.data.pageSub++;
        this.setData({ resultSub: this.data.resultSub.concat(result)});
      }
      Toast.hiddenLoading();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})