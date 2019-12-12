// pagesIndex/myDynamicList/myDynamicList.js
import Protocol from "../../modules/network/protocol";
import { Toast as toast, WXDialog } from "heheda-common-view";

Page({

  /**
   * 页面的初始数据
   */
  data: {
      pageIndex:1,
      isShowlist:false,
      backColor:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
      this.getDynamicList()
      console.log('result',this.data.list)
  },
   async getDynamicList(){
       const { result: { list: list } } = await Protocol.postMydynamicList({ page: this.data.pageIndex });
       if(list.length>0){
           this.setData({
               list:list,
               backColor:"#E7E7E7",
               isShowlist:true
           })
       }else{
           this.setData({
               isShowlist:false,
               backColor:"#FFFFFF",
           })

       }

    },
   async onDynamicItemDeleteEvent({detail}) {
       await Protocol.postDynamicDelete({id: detail.taskId})
       this.getDynamicList()
       toast.success('删除成功',800);
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
  async onReachBottom() {
      const { result: { list: list } } = await Protocol.postMydynamicList({ page: this.data.pageIndex });
      const dataList = list
      if (this.data.list.length) {
          this.data.pageIndex++;
          this.setData({ list: this.data.list.concat(dataList) });
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
