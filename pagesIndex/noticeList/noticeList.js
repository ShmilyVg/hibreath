// pagesIndex/noticeList/noticeList.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import { Toast as toast, WXDialog } from "heheda-common-view";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: '',
    MessageDetailId:'',
    read: '#F8FAFC',
    total:'',
    pageIndex:1,
    isDelete:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      groupId: options.groupId
    });
    if(this.data.groupId){
      this.postDynamicNotice();
    }else{
      console.log("消息");
      this.postDynamicNoticeMembers();
    }
    Protocol.postNoticeUpdateAll();
  },
  async postDynamicNoticeMembers() {
    const { result: { list: list,unreadNum:unreadNum } } = await Protocol.postDynamicNoticeMembers({ page: this.data.pageIndex });
    if (list.length) {
      this.data.pageIndex++;
    }
    console.log(list );
    const noticeList= list.map(item => {
      return { ...item, timeDiff: this.getDateDiff(item.timeDiff) };
    });
    console.log(noticeList);
    this.setData({
      noticeList: noticeList,
      unreadNum:unreadNum
    })
  },
  async postDynamicNotice() {
    const { result: { list: list,unreadNum:unreadNum } } = await Protocol.postDynamicNotice({ page: this.data.pageIndex, groupId: this.data.groupId });
    if (list.length) {
        this.data.pageIndex++;
      }
    console.log(list )
    const noticeList= list.map(item => {
        return { ...item, timeDiff: this.getDateDiff(item.timeDiff) };
      })
    console.log(noticeList);
    this.setData({
      noticeList: noticeList,
      unreadNum:unreadNum
    })
  },

  toMessageDetail: function (e) {
    console.log("e",e)
    this.data.MessageDetailId = e.currentTarget.dataset.index;
    this.data.isDelete = e.currentTarget.dataset.isdelete;
    console.log(e.currentTarget.dataset.isdelete)
    if (this.data.isDelete){
      console.log(111)
      wx.showModal({
        title: '',
        content: '该条动态已被删除',
        showCancel:false,
        confirmText:'我知道了',
        success(res) {
          if (res.confirm) {
            //console.log('用户点击确定')
          } else if (res.cancel) {
            //console.log('用户点击取消')
          }
        }
      })
      //console.log(111)
    }else{
      //console.log(222)
      HiNavigator.navigateToMessageDetail({ messageId: this.data.MessageDetailId });
    }
    
    
  },
  getDateDiff:function(dateTime) {
    let diffValue = dateTime;
      let result = '';
      let minute = 1000 * 60;
      let hour = minute * 60;
      let day = hour * 24;
      let halfamonth = day * 15;
      let month = day * 30;
      let year = day * 365;
      let now = new Date().getTime();
      if(diffValue < 0) {
        return diffValue;
        }
    let monthEnd = diffValue / month;
      let weekEnd = diffValue / (7 * day);
      let dayEnd = diffValue / day;
      let hourEnd = diffValue / hour;
      let minEnd = diffValue / minute;
      let yearEnd = diffValue / year;
      if(yearEnd >= 1) {
    result = dateTime;
    } else if (monthEnd >= 1) {
      result = "" + parseInt(monthEnd) + "月前";
      } else if (weekEnd >= 1) {
      result = "" + parseInt(weekEnd) + "周前";
      } else if (dayEnd >= 1) {
      result = "" + parseInt(dayEnd) + "天前";
      } else if (hourEnd >= 1) {
      result = "" + parseInt(hourEnd) + "小时前";
      } else if (minEnd >= 1) {
      result = "" + parseInt(minEnd) + "分钟前";
    } else {
      result = "刚刚";
    }
    return result;
    },
    deleteNotice:function(){
      Protocol.postNoticeUpdate().then(()=>{
        this.postDynamicNotice();
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
  async onReachBottom () {
    if(this.data.groupId){
      const { result: { list: list } } = await Protocol.postDynamicNotice({ page: this.data.pageIndex, groupId: this.data.groupId })
      const dataList = list.map(item => {
        return { ...item, timeDiff: this.getDateDiff(item.timeDiff) };
      });
      console.log(dataList);
      if (dataList.length) {
        this.setData({ noticeList: this.data.noticeList.concat(dataList) });
      }
    }else{
      const { result: { list: list } } = await Protocol.postDynamicNoticeMembers({ page: this.data.pageIndex});
      const dataList = list.map(item => {
        return { ...item, timeDiff: this.getDateDiff(item.timeDiff) };
      });
      console.log(dataList);
      if (dataList.length) {
        this.setData({ noticeList: this.data.noticeList.concat(dataList) });
      }
    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})