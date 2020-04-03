/**
 * @Date: 2019-09-23 16:15:14
 * @LastEditors: 张浩玉
 */
//index.js
//获取应用实例

import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";
import ConnectionManager from "./connection-manager";
import BlowManager from "./blow-manager";
import * as tools from "../../utils/tools";
import {ConnectState, ProtocolState} from "../../modules/bluetooth/bluetooth-state";
import {common} from "../../modules/bluetooth/heheda-bluetooth/app/common";
import HiBreathBlueToothManager from "../../modules/bluetooth/hi-breath-bluetooth-manager";
import CommonProtocol from "../../modules/network/network/libs/protocol";
import {WXDialog} from "heheda-common-view"; //页面标志位使用
const app = getApp();
const log = require('../../log.js')
var mta= require('../../utils//mta_analysis.js')
Page({
    data: {
        userInfo: {},
        firstInto: true,
        isBind:false,
        noBind:false,
        tryAgain:false,
        finding:false,
        beginFat:false,
        readyimg:false,
        blowpicShow:false,
        textState:"",
        textStateEn:"",
        disblowImg:false,
        blowingImg:false,
        process:false,
        isShowBlow:true,
        needCheckOTAUpdate:false,
        noUpdata:false,//如果点击OTA升级 则跳转时不执行 onUnload 中的跳转 正常跳转到升级页面
        homeP:[
            "1. 请勿将设备远离手机",
            "2. 请勿关闭小程序",
            "3. 请勿关闭手机蓝牙",
            "4. 请勿熄灭屏幕"
        ],
        readImgList:[
            'https://img.hipee.cn/hibreath/icon/dg.png',
            'https://img.hipee.cn/hibreath/icon/yashua.png',
            'https://img.hipee.cn/hibreath/icon/jiubei.png',
            'https://img.hipee.cn/hibreath/icon/xiyan.png',
            'https://img.hipee.cn/hibreath/icon/kouhong.png',
            'https://img.hipee.cn/hibreath/icon/xiangshui.png'
        ],
        readImgHead:[
            "吃零食",
            "刚刷完牙",
            "饮酒饮料",
            "抽烟",
            "涂抹口红",
            "喷洒香水"
        ],
        homeTitle: false,
        homeOrangeBtn: false,
        resultDelta:1,
        electricitypicShow: false,
        navBarColor:'',//导航字体颜色
        navBarIconTheme:'',//导航返回键颜色
        navBarBackground:'',//导航背景色
        isHidden:false,//从后台回到前台

    },
    disconnectBtnClick() {
      let that = this;
      wx.getSystemInfo({
        success (res) {
          if(res.locationEnabled && res.bluetoothEnabled && res.locationAuthorized){
            if (that.data.stateBtnShow){
              app.getBLEManager().connect();
            }
            return
          }else if(!res.bluetoothEnabled){
            setTimeout(() => {
              WXDialog.showDialog({title: '小贴士', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了'});
            },200);
            return
          }else if(!res.locationEnabled){
            setTimeout(() => {
              WXDialog.showDialog({title: '小贴士', content: '请开启手机GPS', confirmText: '我知道了'});
            },200);
            return
          }else if(!res.locationAuthorized){
            setTimeout(() => {
              wx.showModal({
                title: '小贴士',
                content: '前往手机【设置】->找到【微信】应用\n' +
                  '\n' +
                  '打开【微信定位/位置权限】',
                showCancel: false,
                confirmText: '我知道了',
              })
            },200);
            return
          }
        }
      })
    },

    setBtnClick() {
        HiNavigator.navigateToDeviceUnbind();
    },
    handlerGobackClick(){
        console.log('app.getLatestBLEState().connectState',app.getLatestBLEState().connectState)
        if(app.getLatestBLEState().connectState ==='connected'){
            app.bLEManager.sendISvalue({isSuccess: false});
            console.log('小程序在燃脂页面点击返回的时候告知了设备不要上传在线监测数据')
        }
        if(this.data.isSuccessInfo === "true"){
            let pages = getCurrentPages();
            for(var i = 0;i<pages.length;i++){
                if(pages[i].route ==='pages/result/result'){
                    this.setData({
                        resultDelta:this.data.resultDelta+i
                    })
                    wx.navigateBack({
                        delta:pages.length-this.data.resultDelta
                    })
                    return;
                }
            }
            HiNavigator.switchToSetInfo()
            return
        }
        HiNavigator.navigateBack({delta: 1});
    },
    preheatImg(){

    },
    onLaunch(options){
        this.commonOnLaunch({options, bLEManager: new HiBreathBlueToothManager()});
    },
    //离开页面时通知设备储存离线数据
    onHide() {
        if(app.getLatestBLEState().connectState ==='connected'){
            const pages = getCurrentPages()
            const currentPage = pages[pages.length - 1]  // 当前页
            if(currentPage.route ==='pagesIndex/index/index'){
                this.setData({
                    isHidden:true
                })
                app.bLEManager.sendISvalue({isSuccess: false});
                console.log('小程序 在index页面 前台进入后台 发送了40 02命令  告知了设备不要上传在线监测数据')
            }

        }
    },
    onLoad(e) {
        if(app.getLatestBLEState().connectState ==='connected'){
            const pages = getCurrentPages()
            const currentPage = pages[pages.length - 1]  // 当前页
            if(currentPage.route ==='pagesIndex/index/index'){
                app.bLEManager.sendISvalue({isSuccess: true});
                console.log('小程序在index页面发送40 01命令')
                app.bLEManager.startData();
                console.log('小程序在index页面发送了同步状态的指令')
            }
        }
        console.log('isSuccessInfo',e)
        if(e.isSuccessInfo){
            this.setData({
                isSuccessInfo: e.isSuccessInfo
            })
        }

        //检测页面保持常亮
        wx.setKeepScreenOn({
            keepScreenOn: true
        });

        this.connectionPage = new ConnectionManager(this);
        //this.connectionPage.unbind();
        this.blowPage = new BlowManager(this);
        console.log('this.blowPagethis.blowPage',this.blowPage)
        //this.blowPage.blowing();
        app.onGetUserInfo = ({userInfo}) => this.setData({userInfo});
        let info = app.globalData.userInfo;
        console.log(app.globalData,"globalData")
        if(info) {
            this.setData({
                userInfo: info
            })
        }
        if(this.data.firstInto) {
            Protocol.getAnalysisNotes().then(data => {
                let noteList = data.result.list;

                this.setData({
                    noteList: noteList,
                    firstInto: false
                })
            });
        }

        /*电量测试*/
        let globalBattery = app.globalData.globalBattery;
        console.log('全局电量：', globalBattery);
        if (globalBattery === 1) {
            app.onBatteryInfoListener = ({battery}) => {
                if (battery) {
                    this.setData({
                        electricitypicShow: true
                    })
                }
            }
        } else {
            if (globalBattery === 2) {
                this.setData({
                    electricitypicShow: true
                })
            } else if (globalBattery === 3) {
                this.setData({
                    electricitypicShow: false
                })
            }
            setTimeout(function () {
                app.globalData.globalBattery = 0;
            }, 5000);
        }
        /*电量测试*/

        Protocol.getDeviceBindInfo().then(data => {
            this.setData({
                ...data.result
            })
            console.log('获取到的设备', data);
            if (!this.data.mac) {
                app.getBLEManager().clearConnectedBLE();
                this.connectionPage.unbind();
            } else {
                app.getBLEManager().setBindMarkStorage();
                console.log('app.getLatestBLEState().connectState', app.getLatestBLEState().connectState)
                if(app.getLatestBLEState().connectState !== 'connected'){
                    app.getBLEManager().connect({macId: this.data.mac});
                }
            }
        });

    },

    onShow(options) {
        if(app.getLatestBLEState().connectState ==='connected' && this.data.isHidden){
            const pages = getCurrentPages()
            const currentPage = pages[pages.length - 1]  // 当前页
            if(currentPage.route ==='pagesIndex/index/index'){
                this.setData({
                    isHidden:false
                })
                app.bLEManager.sendISvalue({isSuccess: true});
                console.log('小程序 在index页面 后台进入前台后 发送了40 01命令')
                setTimeout(()=>{
                    app.bLEManager.startData();
                },1000)
            }
        }

        console.log(this.blowPage._page.data.needCheckOTAUpdate,this.blowPage._page.data,'this.data.needCheckOTAUpdate')
        const action = this.connectionPage.action;
        const actionBlow = this.blowPage.actionBlow;

        let {connectState, protocolState} = app.getLatestBLEState();
        console.log("app.getLatestBLEState()",app.getLatestBLEState())
        if (ProtocolState.BREATH_RESULT === protocolState) {
            protocolState = ProtocolState.CONNECTED_AND_BIND;
        }
        console.log('index页面connectState打印',connectState)
        console.log('index页面protocolState打印',protocolState)
        !!action[connectState] && action[connectState]();
        !!actionBlow[protocolState] && actionBlow[protocolState]();
        app.setBLEListener({
            bleStateListener: () => {
                console.log("查看电量2222",app.getLatestBLEState())
                const {connectState, protocolState} = app.getLatestBLEState();
                console.log("connectState",connectState)
                console.log("protocolState",protocolState)
                if(connectState ==='connected'){
                    const pages = getCurrentPages()
                    const currentPage = pages[pages.length - 1]  // 当前页
                    if(currentPage.route ==='pagesIndex/index/index'){
                        app.bLEManager.sendISvalue({isSuccess: true});
                        console.log('小程序在index发送40 01命令,可上传在线检测数据')
                    }
                }
                !!action[connectState] && action[connectState]();
                !!actionBlow[protocolState] && actionBlow[protocolState]();
            },
            receiveDataListener: ({finalResult, state}) => {
                console.log("在线检测数值处理前",finalResult)
                /*
                 PRE_HOT_START: 'pre_hot_start',//开始预热状态
                 PRE_HOT_FINISH_AND_START_BREATH: 'pre_hot_finish_and_start_breath',//预热完成开始吹气
                 BREATH_RESULT: 'breath_result',//吹气完成返回结果
                 BREATH_RESTART: 'breath_restart',//重新吹气
                 BREATH_START: 'breath_start',//设备发出的开始吹气通知
                 BREATH_FINISH: 'breath_finish',//设备发出的吹气完成通知
                 */
                if (ProtocolState.BREATH_RESULT === state.protocolState) {
                    //上传PPM并跳转结果页
                  /*  const toolfinalResult = tools.resultRe(tools.subStringNum(finalResult.result))*/
                    const toolfinalResult = parseInt(finalResult.result)
                    console.log('在线检测数值处理前',finalResult.result)
                    console.log('在线检测数值处理后',toolfinalResult)
                    log.warn('在线检测数值处理前',finalResult.result)
                    log.warn('在线检测数值处理后',toolfinalResult)
                    Protocol.getBreathDataAdd({
                        dataValue: toolfinalResult,
                    }).then(data => {
                        console.log(data.result.id)
                        HiNavigator.navigateToLowFatReport()
                        /*HiNavigator.redirectToBlowToResult({id: data.result.id,integral: data.result.integral,inTaskProgress: data.result.inTaskProgress,integralTaskTitle: data.result.integralTaskTitle});*/
                    });

                    //TIMESTAMP 设备获取时间戳
                }else if (ProtocolState.TIMESTAMP === state.protocolState) {
                    const {battery} = finalResult;
                    console.log("查看电量4444",finalResult)
                    if(battery < 20){
                        this.setData({
                            electricitypicShow: true,
                        })
                    }else{
                        this.setData({
                            electricitypicShow: false,
                        })
                    }
                }
            }
        });
        if (!this.data.firstInto) {

        }
    },


    onGetUserInfoEvent(e) {
        wx.getSystemInfo({
            success (res) {
                if(res.locationEnabled && res.bluetoothEnabled && res.locationAuthorized){
                    HiNavigator.navigateToDeviceBind()
                    return
                }else if(!res.bluetoothEnabled){
                    setTimeout(() => {
                        WXDialog.showDialog({title: '小贴士', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了'});
                    },200);
                    return
                }else if(!res.locationEnabled){
                    setTimeout(() => {
                        WXDialog.showDialog({title: '小贴士', content: '请开启手机GPS', confirmText: '我知道了'});
                    },200);
                    return
                }else if(!res.locationAuthorized){
                    setTimeout(() => {
                      wx.showModal({
                        title: '小贴士',
                        content: '前往手机【设置】->找到【微信】应用\n' +
                          '\n' +
                          '打开【微信定位/位置权限】',
                        showCancel: false,
                        confirmText: '我知道了',
                      })
                    },200);
                    return
                }
            }
        })
        /*const {detail: {userInfo, encryptedData, iv}} = e;
        if (!!userInfo) {
            Toast.showLoading();
            Login.doRegister({
                userInfo,
                encryptedData,
                iv
            })
            .then(() => UserInfo.get())
            .then(({userInfo}) => !this.setData({userInfo}) && HiNavigator.navigateToDeviceBind())
            .catch(() => setTimeout(Toast.warn, 0, '获取信息失败')).finally(Toast.hiddenLoading);
        }*/
     /*   wx.openBluetoothAdapter({
            success (res) {
                console.log(res,'success')
                HiNavigator.navigateToDeviceBind()
            },
            fail (res) {
                console.log(res,'fail')
                if(res.errCode == 10001 ||res.errCode == 10000){
                    setTimeout(() => {
                        WXDialog.showDialog({title: 'TIPS', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了'});
                    },200);
                }
            }
        })*/
    },
    onUnload() {
     /* 关闭蓝牙适配器  app.getBLEManager().closeAll();
        console.log("2323",getCurrentPages())
        console.log(this.data.isSuccessInfo,'this.data.isSuccessInfo')*/

        if(app.getLatestBLEState().connectState ==='connected'){
            var pages = getCurrentPages()    //获取加载的页面
            var currentPage = pages[pages.length-1]    //获取当前页面的对象
            console.log('当前页面是',currentPage.route)
            if(currentPage.route ==='pagesIndex/index/index'){
                app.bLEManager.sendISvalue({isSuccess: false});
                console.log('页面卸载的时候 小程序告知了设备不要上传在线监测数据,需当做离线数据处理')
            }
        }
    },


    ...common
});
