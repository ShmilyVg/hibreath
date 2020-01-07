// pagesIndex/dayReportConclude/dayReportConclude.js
import Protocol from "../../modules/network/protocol";
import {
  Toast as toast,
  Toast,
  WXDialog
} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";
Page({
  data: {
    reportList: [],
    page:1,
    limit:20,
    lastPage:false,
    imgCon: {
      '即将燃脂': '../images/dayReportConclude/level1.png',
      '低速燃脂': '../images/dayReportConclude/level2.png',
      '状态极佳': '../images/dayReportConclude/level3.png',
      '快速燃脂': '../images/dayReportConclude/level4.png',
      '过度燃脂': '../images/dayReportConclude/level5.png'
    }
  },

  onLoad: function (options) {
    this.getTodayLosefatReportListPage()
  },

  async getTodayLosefatReportListPage(type) {
    let data = {
      page: this.data.page,
      limit: this.data.limit
    }
    toast.showLoading('加载中.....');
    let res = await Protocol.getTodayLosefatReportListPage(data);
    toast.hiddenLoading();
    let reportList = JSON.parse(JSON.stringify(this.data.reportList))  ;
    if (type == 'Down'){
      reportList =[];
    }
    if (res.result.length > 0){
      reportList = [...reportList,...res.result];
      reportList.sort(function(a,b){
        let aT = new Date(a.dateTime).getTime();
        let bT = new Date(b.dateTime).getTime();
        return bT - aT;
      })
      this.setData({
        lastPage:false,
        reportList: reportList
      })
    }else{
      // toast.success('已经加载所有数据')
      this.setData({
        lastPage: true
      })
    }
    wx.stopPullDownRefresh();
  },
  goReport(e){
    let index = e.currentTarget.dataset['index'];
    let reportId = this.data.reportList[index].reportId;
    HiNavigator.navigateToLowFatReport(reportId);
  },
  onReachBottom: function () {
    let page = this.data.page;
    this.setData({
      page: ++page
    })
    this.getTodayLosefatReportListPage();
  },
  onPullDownRefresh: function () {
    this.setData({
      page:1,
    })
    this.getTodayLosefatReportListPage('Down');
  },
})