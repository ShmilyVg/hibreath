// pages/result/result.js
/**
 * @Date: 2019-09-23 14:30:30
 * @LastEditors: 张浩玉
 */
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
import {
  Toast,
  WXDialog
} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";
import * as Trend from "../../view/trend";
import * as Circular from "./view/circular";
import {
  getEndZeroTimestamp,
  getFrontZeroTimestamp,
  getLatestOneWeekTimestamp,
  getTimeString
} from "../../utils/time";
import {
  previewImage,
  showActionSheet
} from "../../view/view";
var mta = require('../../utils//mta_analysis.js')
const timeObj = {
  _frontTimestamp: 0,
  _endTimestamp: 0,
  set frontTimestamp(timestamp) {
    this._frontTimestamp = getFrontZeroTimestamp({
      timestamp
    });
  },
  get frontTimestamp() {
    return this._frontTimestamp;
  },
  set endTimestamp(timestamp) {
    this._endTimestamp = getEndZeroTimestamp({
      timestamp
    });
  },
  get endTimestamp() {
    return this._endTimestamp;
  }
};

Page({
  data: {
    score: 0, //传入的进度， 0~100，绘制到此参数处停止。
    currenttab: '0',
    trendDate: '',
    page: 1,
    tabIsShow: true,
    fatText: '',
    fatTextEn: '',
    fatDes: '',
    ppmModalStatus:false,
    animation_ppm:{},
    status:{
      '未燃脂': ['#D0E5CC', '#D0E5CC', '#D0E5CC', '#D0E5CC', '#5D6AED'],
      '稳步燃脂': ['#D0E5CC', '#D0E5CC', '#D0E5CC', '#009DFF', '#009DFF'],
      '状态极佳': ['#D0E5CC', '#D0E5CC', '#0AC1A1', '#0AC1A1', '#0AC1A1'],
      '快速燃脂': ['#D0E5CC', '#FFAD00', '#FFAD00', '#FFAD00', '#FFAD00'],
      '过度燃脂，急需注意': ['#FF6100', '#FF6100', '#FF6100', '#FF6100', '#FF6100'],
      '过度燃脂，危险状态': ['#FF6100', '#FF6100', '#FF6100', '#FF6100', '#FF6100'],
    },
  },
  async onLoad(e) {
    console.log('eeeeeee', e)
    this.cellDataHandle({});
    
    /*存在id 即为在线检测进入结果页面*/
    if (e.id) {
      const {
        result
      } = await Protocol.postIncentive();
      if (result.taskInfo.fatBurn.todayFirst) {
        this.setData({
          showExcitation: true,
          toastType: 'fatBurn',
          toastResult: result,
          canvasMargin: 3000
        })
      }
      this.setData({
        showMytoast: true,
        toastType: 'fatBurn',
        inTaskProgress: JSON.parse(e.inTaskProgress),
        integral: e.integral,
        integralTaskTitle: e.integralTaskTitle,
      })
      console.log('inTaskProgressinTaskProgress', this.data.inTaskProgress)
      setTimeout(() => {
        this.setData({
          showMytoast: false
        })
      }, 3000)
    }
    this.setData({
      isReport:e.isReport
    })
  },
  getShowExcitation(e) {
    console.log('e11', e)
    this.setData({
      showExcitation: e.detail.showExcitation,
      canvasMargin: 0
    })
  },
  init() {
    Trend.init(this);
    Trend.initTouchHandler();
    setTimeout(() => {
      Circular.init(this);
    }, 200)
  },

  async cellDataHandle({
    page = 1,
    isRefresh = true
  }) {
    console.log('结束时间加几秒解决最新一条不显示的问题', Date.now())
    Toast.showLoading();
    let {
      result: {
        list,
        bestBreathData,
        lastBreathData
      }
    } = await Protocol.getBreathDataList({
      page,
      pageSize: 20
    });

    if (list.length>0) {
      if (page == 1) {
        this.setData({
          fatText: lastBreathData.desZh,
          score: lastBreathData.dataValue,
          fatTextEn:lastBreathData.des.en,
          fatDes: lastBreathData.visDes,
        })
        setTimeout(() => {
          console.log('绘制一次')
          Circular.run();
        }, 500)

      }
      
      list.map(value => {
        const {
          time,
          day,
          month,
          year
        } = tools.createDateAndTime(value.time * 1000);
        value.date = `${year}/${month}/${day} ${time}`;
        let image = '../../images/result/cell';
        const dValue = value.dataValue;
        if (dValue >= 0 && dValue <= 2) {
          image = image + '1';
        } else if (dValue >= 3 && dValue <= 9) {
          image = image + '2';
        } else if (dValue >= 10 && dValue <= 19) {
          image = image + '3';
        } else if (dValue >= 20 && dValue <= 39) {
          image = image + '4';
        } else if (dValue >= 40) {
          image = image + '5';
        }
        image = image + '.png';
        value.image = image
      });

      if (isRefresh) {
        this.data.page = 1;
      } else {
        list = this.data.trendData.concat(list);
      }
      this.setData({
        trendData: list
      });
    } else {
      if (isRefresh) {
        this.setData({
          trendData: []
        })
      } else {
        --this.data.page;
      }
    }
    wx.stopPullDownRefresh();
    Toast.hiddenLoading();
    console.log('trendData',this.data.trendData)
  },
  //获取任务信息
  async getTaskInfo() {
    const { result } = await Protocol.getTaskInfo();
    this.setData({
      taskInfo: result
    })
  },
  toBind() {
    HiNavigator.navigateToDeviceUnbind();
  },

  toIndex() {
    //检测蓝牙状态
    wx.getSystemInfo({
      success(res) {
        console.log('locationEnabled', res.locationEnabled, res.bluetoothEnabled)
        if (res.locationEnabled && res.bluetoothEnabled && res.locationAuthorized) {
          Toast.showLoading();
          HiNavigator.navigateIndex();
          Toast.hiddenLoading();
          return
        } else if (!res.bluetoothEnabled) {
          setTimeout(() => {
            WXDialog.showDialog({
              title: '小贴士',
              content: '您的手机蓝牙未开启\n请开启后重试',
              confirmText: '我知道了'
            });
          }, 200);
          return
        } else if (!res.locationEnabled) {
          setTimeout(() => {
            WXDialog.showDialog({
              title: '小贴士',
              content: '请开启手机GPS/位置',
              confirmText: '我知道了'
            });
          }, 200);
          return
        } else if (!res.locationAuthorized) {
          setTimeout(() => {
            wx.showModal({
              title: '小贴士',
              content: '前往手机【设置】->找到【微信】应用\n' +
                '\n' +
                '打开【微信定位/位置权限】',
              showCancel: false,
              confirmText: '我知道了',
            })
          }, 200);
          return
        }
      }
    })

  },
  //左上角返回逻辑
  handlerGobackClick() {
    if(this.data.isReport === 'true' && this.data.isToday){
      HiNavigator.switchToSetInfo()
    }else{
      HiNavigator.navigateBack({delta: 1});
    }
  },
  async handleTrend({
    list
  }) {
    if (list && list.length) {
      let dataListX = [],
        dataListY = [];
      list.sort(function(item1, item2) {
        return item1.time * 1000 - item2.time * 1000;
      }).forEach((value) => {
        const {
          month,
          day
        } = tools.createDateAndTime(value.time * 1000);
        dataListX.push(month + '月' + day + '日');
        dataListY.push(value.dataValue);
      });
      let dataTrend = {
        dataListX,
        dataListY,
        dataListY1Name: 'PPM',
        yAxisSplit: 5
      };
      Trend.setData(dataTrend);
    } else {
      wx.showToast({
        title: '该时间段内没有燃脂数据',
        icon: 'none',
        duration: 2000
      })
    }

  },
  toBurnDay(){
    HiNavigator.navigateToBurnDay()
  },
  toChooseDate() {
    wx.navigateTo({
      url: '../calendar/calendar?type=' + 'breath'
    });
  },

  onReachBottom() {
    console.log('onReachBottom');
    if (this.data.currenttab === '0') {
      this.cellDataHandle({
        page: ++this.data.page,
        isRefresh: false
      })
    }
  },

  onPullDownRefresh() {
    console.log('onPullDownRefresh');
    if (this.data.currenttab === '0') {
      this.cellDataHandle({});
    } else {
      wx.stopPullDownRefresh();
    }
  },

  onPageScroll: function(e) {
    this.data.tabIsShow = !(e.scrollTop > 430);
    this.setData({
      tabIsShow: this.data.tabIsShow
    })
  },

  async onShow() {
    this.init();
    const trendTime = getApp().globalData.trendTime;
    console.log('trendTime:', trendTime);
    if (trendTime) {
      const {
        startTimeValue,
        endTimeValue
      } = trendTime;
      this.updateTrendTime({
        frontTimestamp: startTimeValue,
        endTimestamp: endTimeValue
      });
      getApp().globalData.trendTime = null;
    }
    this.cellDataHandle({});
    this.getTaskInfo()
  },

  onReady() {
    Circular.createSelectorQuery();
    Trend.init(this);
    Trend.initTouchHandler();
  },
  onHide() {
    this.setData({
      showExcitation: false,
      canvasMargin: 0
    });
  },
  onUnload() {
    // getApp().globalData.issueRefresh = true
    // var pages = getCurrentPages() //获取加载的页面
    // var currentPage = pages[pages.length - 2] //获取上一页
    // console.log('getApp()', currentPage.route)
    // if (currentPage.route === 'pages/personalCenter/personalCenter') {
    //   HiNavigator.switchToPersonalCenter()
    // } else {
    //   HiNavigator.switchToSetInfo()
    // }

  },
  async updateTrendTime({
    frontTimestamp,
    endTimestamp
  }) {
    timeObj.frontTimestamp = frontTimestamp;
    timeObj.endTimestamp = endTimestamp;
    let {
      result: { dateTiem: list }
    } = await Protocol.postBreathDatalist();
    if (list && list.length) {
      this.setData({
        trendDate: getTimeString({
          frontTimestamp: timeObj.frontTimestamp,
          endTimestamp: timeObj.endTimestamp
        })
      }, async() => {
        this.handleTrend({
          list
        });
      });
    } else {
      wx.showToast({
        title: '暂无燃脂数据',
        icon: 'none',
        duration: 2000
      })
    }

  },
  isToday(str) {
    if (new Date(str).toDateString() === new Date().toDateString()) {
      console.log("当天");
      this.setData({
        isToday:true
      })
    } else if (new Date(str) < new Date()){
      //之前
      console.log("以前的日期");
      this.setData({
        isToday:false
      })
    }
  },
  async deleteDataValue(e) {
    try {
      const {
        tapIndex
      } = await showActionSheet({
        itemList: ['删除记录'],
        itemColor: "#ED6F69"
      });
      switch (tapIndex) {
        case 0:
          WXDialog.showDialog({
            content: '确定要删除记录',
            showCancel: true,
            confirmText: "确定",
            cancelText: "取消",
            confirmEvent: () => {
              this.data.breathid = e.currentTarget.dataset.index;
              this.data.createdTimestamp = e.currentTarget.dataset.time;
              const index = this.data.trendData.findIndex(item => item.id === this.data.breathid);
              Protocol.postDeleteBreathData({
                id: this.data.breathid
              }).then(() => {
                if (index !== -1) {
                  this.isToday(this.data.createdTimestamp)
                  console.log('是否符合条件',this.data.isReport,this.data.isToday)
                  this.data.trendData.splice(index, 1);
                  this.setData({
                    trendData: this.data.trendData
                  });
                  Protocol.getBreathDataList({
                    page: 1,
                    pageSize: 20
                  }).then((res) => {
                    console.log(res, 'resss')
                    this.setData({
                      fatText: res.result.list[0].desZh,
                      score: res.result.list[0].dataValue,
                      fatTextEn: res.result.list[0].des.en,
                      fatDes: res.result.list[0].visDes,
                    })
                    setTimeout(() => {
                      console.log('绘制一次')
                      Circular.run();
                    }, 500)
                    this.getTaskInfo()
                  })
                }
              })

            },
            cancelEvent: () => {

            }
          });
          break;
      }
    } catch (e) {
      console.warn(e);
    }
  },
  // 显示PPM介绍
  ppmshow() {
    HiNavigator.navigateToPPM();
    return;
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in-out",
      delay: 0
    });
    this.animation_ppm = animation;
    animation.translateY(500).step();
    this.setData({
      animation_ppm: animation.export(),
      ppmModalStatus: true,
    });
    setTimeout(
      function () {
        animation.translateY(0).step();
        this.setData({
          animation_ppm: animation.export()
        });
      }.bind(this),
      200
    );
  },
  ppmhide: function () {
    
    this.setData({
      ppmModalStatus: false,
    });
    setTimeout(() => { Circular.run();},50)
  },
});