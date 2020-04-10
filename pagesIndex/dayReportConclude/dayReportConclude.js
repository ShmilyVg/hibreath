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
    status: {
      'kong': ['#D0E5CC', '#D0E5CC', '#D0E5CC', '#D0E5CC', '#D0E5CC'],
      '未燃脂': ['#D0E5CC', '#D0E5CC', '#D0E5CC', '#D0E5CC', '#5D6AED'],
      '稳步燃脂': ['#D0E5CC', '#D0E5CC', '#D0E5CC', '#009DFF', '#009DFF'],
      '状态极佳': ['#D0E5CC', '#D0E5CC', '#0AC1A1', '#0AC1A1', '#0AC1A1'],
      '快速燃脂': ['#D0E5CC', '#FFAD00', '#FFAD00', '#FFAD00', '#FFAD00'],
      '过度燃脂，急需注意': ['#FF6100', '#FF6100', '#FF6100', '#FF6100', '#FF6100'],
      '过度燃脂，危险状态': ['#FF6100', '#FF6100', '#FF6100', '#FF6100', '#FF6100'],
    },
  },

  onLoad: function (options) {
    this.getTodayLosefatReportListPage()
  },

  async getTodayLosefatReportListPage(type) {
    let data = {
      page: this.data.page,
      limit: this.data.limit
    }
    toast.showLoading();
    let res = await Protocol.getTodayLosefatReportListPage(data);
  /*  setTimeout(()=>{
      wx.hideLoading();
    },500)*/
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
      reportList.push({
        "dataDesc": "",
        "dateTime": "2020/04/10 16:33",
        "reportId": 152,
        "dataValueToday": '',
        "weightToday": 68
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
