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
    lastPage:false,
    imgCon: {
      '低速燃脂': '../images/dayReportConclude/level1.png',
      '低速燃脂': '../images/dayReportConclude/level2.png',
      '状态极佳': '../images/dayReportConclude/level3.png',
      '快速燃脂': '../images/dayReportConclude/level4.png',
      '过度燃脂': '../images/dayReportConclude/level5.png'
    }
  },

  onLoad: function (options) {
    this.getTodayLosefatReportListPage()
  },

  async getTodayLosefatReportListPage() {
    let data = {
      page: 1,
      limit: 20
    }
    toast.showLoading('加载中.....');
    let res = await Protocol.getTodayLosefatReportListPage(data);
    toast.hiddenLoading();
    let reportList = this.data.reportList;
    if (res.result.length > 0){
      reportList.push(res.resul);
      this.setData({
        lastPage:false,
        reportList: reportList
      })
    }else{
      this.setData({
        lastPage: true
      })
      return;
    }
    
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
      reportList: []
    })
    this.getTodayLosefatReportListPage();
  },
})