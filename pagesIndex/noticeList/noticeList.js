// pagesIndex/noticeList/noticeList.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import {
  Toast as toast,
  WXDialog
} from "heheda-common-view";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: '',
    MessageDetailId: '',
    read: '#F8FAFC',
    total: '',
    my_msg_pageIndex: 1,
    isDelete: '',
    currenttab: 'my_msg',
    typeList: [{
      type: 'my_msg',
      title: '消息'
    }, {
        type: 'dynamic',
      title: '我的动态'
    }],
    dynamic_pageIndex: 1,
    isShowlist: false,
    backColor: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      groupId: options.groupId
    });
    if (this.data.groupId) {
      this.postDynamicNotice();
    } else {
      console.log("消息");
      this.postDynamicNoticeMembers();
    }
    this.getDynamicList()
  },
  async postDynamicNoticeMembers() {
    const {
      result: {
        list: list,
        unreadNum: unreadNum
      }
    } = await Protocol.postDynamicNoticeMembers({
        page: this.data.my_msg_pageIndex
    });
    if (list.length) {
      this.data.my_msg_pageIndex++;
    }
    console.log(list);
    const noticeList = list.map(item => {
      return { ...item,
        timeDiff: this.getDateDiff(item.timeDiff)
      };
    });
    console.log(noticeList);
    this.setData({
      noticeList: noticeList,
      unreadNum: unreadNum
    })
  },
  async postDynamicNotice() {
    const {
      result: {
        list: list,
        unreadNum: unreadNum
      }
    } = await Protocol.postDynamicNotice({
        page: this.data.my_msg_pageIndex,
      groupId: this.data.groupId
    });
    if (list.length) {
      this.data.my_msg_pageIndex++;
    }
    console.log(list)
    const noticeList = list.map(item => {
      return { ...item,
        timeDiff: this.getDateDiff(item.timeDiff)
      };
    })
    console.log(noticeList);
    this.setData({
      noticeList: noticeList,
      unreadNum: unreadNum
    })
  },

  toMessageDetail: function(e) {
    console.log("e", e)
    this.data.MessageDetailId = e.currentTarget.dataset.index;
    this.data.isDelete = e.currentTarget.dataset.isdelete;
    this.data.noticeIsDelete = e.currentTarget.dataset.noticeIsDelete;
    console.log(e.currentTarget.dataset.isdelete);
    console.log(e.currentTarget.dataset.noticeIsDelete);
    if (this.data.isDelete) {
      console.log(111)
      wx.showModal({
        title: '',
        content: '该条动态已被删除',
        showCancel: false,
        confirmText: '我知道了',
        success(res) {
          if (res.confirm) {
            //console.log('用户点击确定')
          } else if (res.cancel) {
            //console.log('用户点击取消')
          }
        }
      })
      //console.log(111)
    } else {
      //console.log(222)
      HiNavigator.navigateToMessageDetail({
        messageId: this.data.MessageDetailId
      });
    }

  },
  getDateDiff: function(dateTime) {
    let diffValue = dateTime;
    let result = '';
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let halfamonth = day * 15;
    let month = day * 30;
    let year = day * 365;
    let now = new Date().getTime();
    if (diffValue < 0) {
      return diffValue;
    }
    let monthEnd = diffValue / month;
    let weekEnd = diffValue / (7 * day);
    let dayEnd = diffValue / day;
    let hourEnd = diffValue / hour;
    let minEnd = diffValue / minute;
    let yearEnd = diffValue / year;
    if (yearEnd >= 1) {
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
  deleteNotice: function() {
    WXDialog.showDialog({
      content: '确定要清空吗？\n' + '清空后无法找回',
      showCancel: true,
      confirmText: "确定",
      cancelText: "取消",
      confirmEvent: () => {
        try {
          Protocol.postNoticeUpdate().then(() => {
            this.setData({
              my_msg_pageIndex: 1
            });
            if (this.data.groupId) {
              this.postDynamicNotice();
            } else {
              this.postDynamicNoticeMembers();
            }
          });
          toast.success('删除成功', 800);
        } catch (e) {

        }

      },
      cancelEvent: () => {

      }
    });
    // Protocol.postNoticeUpdate().then(()=>{
    //     this.setData({
    //         pageIndex: 1
    //     });
    //   this.postDynamicNotice();
    // });
  },
  selectTab(e){
    let newtab = e.currentTarget.dataset.tabid;
    if (this.data.currenttab !== newtab) {
      this.setData({
        currenttab: newtab
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    Protocol.postNoticeUpdateAll();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    if (this.data.currenttab =='my_msg'){
      if (this.data.groupId) {
        const {
          result: {
            list: list
          }
        } = await Protocol.postDynamicNotice({
          page: this.data.my_msg_pageIndex,
          groupId: this.data.groupId
        })
        if (list.length) {
          this.data.my_msg_pageIndex++;
        }
        const dataList = list.map(item => {
          return {
            ...item,
            timeDiff: this.getDateDiff(item.timeDiff)
          };
        });
        console.log(dataList);
        if (dataList.length) {
          this.setData({
            noticeList: this.data.noticeList.concat(dataList)
          });
        }
      } else {
        const {
          result: {
            list: list
          }
        } = await Protocol.postDynamicNoticeMembers({
          page: this.data.my_msg_pageIndex
        });
        if (list.length) {
          this.data.my_msg_pageIndex++;
        }
        const dataList = list.map(item => {
          return {
            ...item,
            timeDiff: this.getDateDiff(item.timeDiff)
          };
        });
        console.log(dataList);
        if (dataList.length) {
          this.setData({
            noticeList: this.data.noticeList.concat(dataList)
          });
        }
      }
    }else{
      this.data.dynamic_pageIndex++;
      const { result } = await Protocol.postMydynamicList({ page: this.data.dynamic_pageIndex });
      const dataList = result.list;
      console.log('dataList', dataList)
      if (this.data.list.length) {
        this.setData({ list: this.data.list.concat(dataList) });
      }
    }
    


  },
  async getDynamicList() {
    const { result: { list: list } } = await Protocol.postMydynamicList({ page: this.data.dynamic_pageIndex });
    if (list.length > 0) {
      this.setData({
        list: list,
        backColor: "#E7E7E7",
        isShowlist: true
      })
    } else {
      this.setData({
        isShowlist: false,
        backColor: "#FFFFFF",
      })

    }

  },
  async onDynamicItemDeleteEvent({ detail }) {
    console.log(detail);
    const { taskId } = detail, { list } = this.data;
    console.log(list);
    const index = list.findIndex(item => item.id === taskId);
    if (index !== -1) {
      await Protocol.postDynamicDelete({ id: detail.taskId })
      list.splice(index, 1);
      this.setData({ list });
      toast.success('删除成功', 800);
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})