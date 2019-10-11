// pages/set-info/set-info.js
/**
 * @Date: 2019-10-09 11:00:00
 * @LastEditors: 张浩玉
 */
import {Toast as toast} from "heheda-common-view";
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
import IndexCommonManager from "../index/view/indexCommon";
import {ProtocolState} from "../../modules/bluetooth/bluetooth-state";
import HiNavigator from "../../navigator/hi-navigator";
import Login from "../../modules/network/login";
import UserInfo from "../../modules/network/userInfo";
import {Toast, WXDialog} from "heheda-common-view";
import * as Circular from "../result/view/circular";
import {common} from "../../modules/bluetooth/heheda-bluetooth/app/common";
import ConnectionManager from "../index/connection-manager";
import {oneDigit} from "../food/manager";

const app = getApp();

Page({
    data: {
        isfatBurn:false,//燃脂卡片
        isbodyIndex:false,//记录身体指标卡片
        isSport:false,

        showGuide: false,//立即体验 未注册状态
        showNewInfo: false,//新手引导页

        noMeasure: false,//没有准确测过体脂率
        sexBox: [
            {image: 'man', text: '男士', isChose: false, value: 1},
            {image: 'woman', text: '女士', isChose: true, value: 0}
        ],
        currentDate: '2018-12-19',
        page: 1,
        title: ['减脂目标', '性别', '出生日期', '身高体重', '体脂率', '您的三餐选择', '推荐目标体重', '选择一套方案'],
        page4MenItem: ['4', '7', '10', '15', '20', '25', '30', '35', '40'],
        page4WomenItem: ['10', '15', '20', '25', '30', '35', '40', '45', '50'],
        birth: ['1980', '01', '01'],
        meals: [
            {text: '外卖为主', isChose: false, en: 'waimai'},
            {text: '外出就餐为主', isChose: false, en: 'waichu'},
            {text: '单位食堂为主', isChose: false, en: 'shitang'}
        ],
        bgColorSetInfoPage: '#ffffff',
        score: 6.5,
        showBigTip: false,
        schemaId: 0,
        scrollLeft: 490,
        timer: '',
        bigTipNum: 0,
        bigTipCountNum: 20,
        sync: {
            num: 0,
            countNum: 0,//需要同步的总数
            timer: ''
        },
        phValue:"写下你的减脂目标",
        bloodLow:"",
        heart:"",
        bloodHeight:"",
        weight:"",
        taskId:"",
        showModalStatus: false,
        animationData: '',
        isfinishedGuide:false,//是否选择了方案
        hiddenImg:false,//隐藏左右箭头
        grayLeft:true,//灰色箭头左
        grayRight:false,//灰色箭头右
        currentSwiper:0
    },
    onFocus: function (e) {
        this.setData({
            isFocus:true,
            phValue:"写下你的减脂目标",
        })
    },
    onBlur: function (e) {
        this.setData({
            isFocus:false,
            phValue: "写下你的减脂目标",
        })
    },
    //上传身体指标
    formSubmit(e){
        console.log(e.detail.value)
        const finaValue = e.detail.value
        if (this.objIsEmpty(finaValue.weight)) {
            toast.warn('请填写体重');
            return;
        }

        const weightnum = finaValue.weight.split(".");
        if (weightnum.length > 1 && weightnum[1] >= 10) {
            this.showDialog("体重至多支持3位整数+1位小数");
            return;
        }
        if (weightnum[0] >= 1000) {
            this.showDialog("体重至多支持3位整数+1位小数");
            return;
        }
        if(finaValue.heart){
            const heartnum = finaValue.heart.split(".");
            if (heartnum.length > 1 || heartnum[0] >= 1000) {
                this.showDialog("心率至多支持3位整数");
                return;
            }
        }
        if(finaValue.bloodHeight){
            const bloodHeightnum = finaValue.bloodHeight.split(".");
            if (bloodHeightnum.length > 1 || bloodHeightnum[0] >= 1000) {
                this.showDialog("高压至多支持3位整数");
                return;
            }
        }
        if(finaValue.bloodHeight && !finaValue.bloodLow){
            this.showDialog("请输入低压");
            return;
        }
        if(finaValue.bloodLow && !finaValue.bloodHeight){
            this.showDialog("请输入高压");
            return;
        }
        if(finaValue.bloodLow){
            const bloodLownum = finaValue.bloodLow.split(".");
            if (bloodLownum.length > 1 || bloodLownum[0] >= 1000) {
                this.showDialog("低压至多支持3位整数");
                return;
            }
        }
        finaValue['taskId'] =this.data.taskId
        Protocol.setBodyIndex(finaValue).then(data => {
            this.handleTasks();
            this.setData({
                showModalStatus: false,
            })
            toast.success('填写成功');
        });
    },
    //同步离线数据
    async onLoad(e) {
       /* this.setData({
            page:wx.getStorageSync('currentPage')
        })*/
        let that = this;
        console.log('on:', e);
        this.connectionPage = new ConnectionManager(this);
        await that.handleGuide(that);
        if (e.isNotRegister) {
            console.log(e.isNotRegister,'000000')
            that.setData({
                showNewInfo: true,
                showGuide: true
            })
        }
        this.handleBaseInfo();
        Circular.init(this);
    },

    handleGuide(that) {
        return new Promise(function (resolve, reject) {
            wx.getSetting({
                success: (res) => {
                    console.log('是否授权', res.authSetting['scope.userInfo']);
                    if (res.authSetting['scope.userInfo'] === undefined) {
                        that.setData({
                            showNewInfo: true,
                            showGuide: true,
                        })
                    } else {
                        that.setData({
                            showNewInfo: false,
                            showGuide: false,
                        })
                    }
                    resolve();
                }
            });
        });
    },
    async handleBaseInfo() {
        const {year, month, day} = tools.createDateAndTime(Date.parse(new Date()));
        const currentDate = `${year}-${month}-${day}`;
        const {result: {list: goals}} = await Protocol.postSettingsGoals();
        const {result: accountInfo} = await Protocol.getAccountInfo();
        const finishedGuide = accountInfo.finishedGuide;
        this.setData({
            isfinishedGuide:finishedGuide
        })
        let info = {};
        if (finishedGuide) {
            this.handleTasks();
        } else {
            info = {
                goalDesc: '',
                sex: 0,
                sexStr: 'woman',
                birthday: '1980-01-01',
                height: '',
                weight: '',
                bodyFatRate: '',
                weightGoal: '',
            };
            // info = accountInfo.detail;
            // this.data.meals.map(value => {
            //     value.isChose = value.en === info.mealType;
            // });
            //
            // this.data.sexBox.map(value => {
            //     value.isChose = info.sex === value.value;
            // });
            //
            // this.data.birth = info.birthday.split("-");
            this.setData({
                currentDate, goals, info,
                showNewInfo: true,
                showGuide: false,
                birth: this.data.birth,
                meals: this.data.meals,
                sexBox: this.data.sexBox,
                bgColorSetInfoPage: '#ffffff'
            });
        }
    },

    handleBle() {
        this.indexCommonManager = new IndexCommonManager(this);
        app.setBLEListener({
            bleStateListener: () => {
                console.log("setPage-bleStateListener", app.getLatestBLEState())
            },
            receiveDataListener: ({finalResult, state}) => {
                console.log("setPage-receiveDataListener", finalResult, state);
            }
        });
        Protocol.getDeviceBindInfo().then(data => {
            let deviceInfo = data.result;
            console.log('获取到的设备', data);

            if (!deviceInfo) {
                app.getBLEManager().clearConnectedBLE();
                this.connectionPage.unbind();
            } else {
                app.getBLEManager().setBindMarkStorage();
                app.getBLEManager().connect({macId: deviceInfo.mac});
            }
        });
        /*  const isBindDevice = wx.getStorageSync('isBindDevice');
          if (isBindDevice) {
              app.getBLEManager().connect();
          }*/
    },

    async handleTasks() {
        const {result} = await Protocol.postMembersTasks();
        this.setData({
            indexDayDesc:result.dayDesc,
            indexfinishNum:result.finishNum,
            indexgoalDesc:result.goalDesc,
            indextaskNum:result.taskNum,
            taskListAll:result.taskList,
        })
        const typesArr = result.taskList.map(d => d.type)
        console.log("123213",typesArr)
        for (var i = 0; i < typesArr.length; i++){
            if(typesArr[i] === "fatBurn"){
                const fatBurnExt = result.taskList[i].ext;
                if (result.taskList[i].finished) {
                    this.setData({
                        isfatBurn:true,
                        fatBurnFin:true,//完成标志位
                        fatBurnTask: result.taskList[i],
                        fatText: fatBurnExt.des.zhCh,
                        fatTextEn: fatBurnExt.des.en,
                        score: fatBurnExt.dataValue,
                        fatDes: fatBurnExt.visDes,
                        fatType:fatBurnExt.iconUrl,
                        bgColorSetInfoPage: '#FEF6F2'
                    });
                    Circular.run();
                } else {
                    this.setData({
                        isfatBurn:true,
                        fatBurnTask: result.taskList[i],
                        bgColorSetInfoPage: '#FEF6F2'
                    });
                }
            }
            if(typesArr[i] === "bodyIndex"){
                const bodyIndexExt = result.taskList[i].ext;
                console.log(bodyIndexExt,"typesArr[i]")
                if (result.taskList[i].finished) {
                    this.setData({
                        isbodyIndex:true,
                        bodyIndexFin:true,
                        bodyIndexTask: result.taskList[i],
                        bodyIndexExt:bodyIndexExt,
                        taskId:result.taskList[i].id
                    })
                    console.log(bodyIndexExt)
                }else{
                    this.setData({
                        isbodyIndex:true,
                        taskId:result.taskList[i].id,
                        bodyIndexTask: result.taskList[i],
                    })
                }
            }
            if(typesArr[i] === "sport"){
                const sportExt = result.taskList[i].ext;
                if (result.taskList[i].finished) {
                    this.setData({
                        sportFin:true,
                    })
                }
                this.setData({
                    isSport:true,
                    sportTask: result.taskList[i],
                    sportExt:sportExt,
                    aheight:sportExt.recommendList.length*158
                })
                if(sportExt.recommendList.length<2){
                    this.setData({
                        hiddenImg: true,
                    })
                }else{
                    this.setData({
                        hiddenImg: false,
                    })
                }

            }
        }
        setTimeout(() => {
            wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#F55E6B',
                /*  animation: {
                      duration: 400,
                      timingFunc: 'easeIn'
                  }*/
            })
        });
    },

    async continue() {
        const info = this.data.info;
        console.log(info.goalDesc.length,'info.goalDesc')
        switch (this.data.page) {
            case 1:
                if (this.objIsEmpty(info.goalDesc)) {
                    toast.warn('请填写目标');
                    return;
                }
                break;
            case 2:
                if (this.objIsEmpty(info.sex)) {
                    toast.warn('请选择性别');
                    return;
                }
                break;
            case 3:
                break;
            case 4:
                if (this.objIsEmpty(info.height)) {
                    toast.warn('请填写身高');
                    return;
                } else if (this.objIsEmpty(info.weight)) {
                    toast.warn('请填写体重');
                    return;
                }
                break;
            case 5:
                if (this.data.noMeasure) {
                    if (this.objIsEmpty(this.data.choseIndex)) {
                        toast.warn('请选择图片');
                        return;
                    } else {
                        let list = this.data.page4MenItem;
                        if (this.data.info.sex === 0) {
                            list = this.data.page4WomenItem;
                        }
                        this.setData({
                            'info.bodyFatRate': list[this.data.choseIndex]
                        });
                    }
                } else {
                    if (this.objIsEmpty(info.bodyFatRate)) {
                        toast.warn('请填写体脂率');
                        return;
                    } else if (parseInt(this.data.info.bodyFatRate) >= 100) {
                        this.showDialog("请输入正确的体脂率，体脂率范围1%-100%");
                        return;
                    } else {
                        const num = this.data.info.bodyFatRate.toString().split(".");
                        if (num.length > 1 && num[1] >= 10) {
                            this.showDialog("至多输入1位小数及两位整数");
                            return;
                        }
                    }
                }
                break;
            case 6:
                let isChoseMeals = false;
                this.data.meals.forEach(value => {
                    if (value.isChose) {
                        isChoseMeals = true;
                    }
                });
                if (!isChoseMeals) {
                    toast.warn('请选择三餐');
                    return
                }
                break;
            case 7:
                if (this.objIsEmpty(info.weightGoal)) {
                    toast.warn('请填写目标体重');
                    return;
                }
                await Protocol.postMembersPut(this.data.info);
                const {result: {list: project}} = await Protocol.postSettingsLosefatSchema();
                this.setData({project});
                break;
            case 8:
                await Protocol.postMembersJoinSchema({schemaId: this.data.schemaId});
                this.handleTasks();
                this.setData({
                    showNewInfo:false
                })
                return;
        }
        this.setData({
            page: ++this.data.page,
        });
       /* wx.setStorageSync({
            currentPage: this.data.page,
        });*/
    },

    objIsEmpty(obj) {
        return (typeof (obj) === "undefined" || obj === "" || obj === null);
    },

    showDialog(content) {
        WXDialog.showDialog({title: '小贴士', content, confirmText: '我知道了'});
    },

    back() {
        this.setData({
            page: --this.data.page
        })
    },

    //减脂目标
    bindInputGoal(e) {
        this.setData({
            'info.goalDesc':  tools.filterEmoji(e.detail.value).trim()
        })
    },

    bindTapSex(e) {
        let choseIndex = e.currentTarget.dataset.index, postSex = 0, sexStr = '';
        this.data.sexBox.map((value, index) => {
            value.isChose = choseIndex == index;
            if (value.isChose) {
                postSex = value.value;
                sexStr = value.image;
            }
        });
        this.setData({
            sexBox: this.data.sexBox,
            'info.sex': postSex,
            'info.sexStr': sexStr
        })
    },

    bindChangeBirth(e) {
        const value = e.detail.value;
        const birthArr = value.split("-");
        this.setData({
            'info.birthday': value,
            birth: birthArr
        })
    },

    bindInputHeight(e) {
        const height = e.detail.value;
        let weightGoal = (height / 100) * (height / 100) * 21;
        weightGoal = weightGoal.toFixed(1);
        this.setData({
            'info.height': height,
            'info.weightGoal': weightGoal
        });
    },

    bindInputWeight(e) {
        this.setData({'info.weight': e.detail.value});
        return oneDigit(e);
    },

    bindInputWeightGoal(e) {
        console.log("231",e.detail.value)
        this.setData({'info.weightGoal': e.detail.value});
        return oneDigit(e);
    },

    bindInputExact(e) {
        this.setData({'info.bodyFatRate': e.detail.value})
        return oneDigit(e);
    },

    bindTapMeals(e) {
        let choseIndex = e.currentTarget.dataset.index;
        this.data.meals.map((value, index) => {
            value.isChose = choseIndex == index;
        });
        const en = this.data.meals[choseIndex].en;
        this.setData({meals: this.data.meals, 'info.mealType': en})
    },

    bindTapExactClick(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            choseIndex: index
        });
    },

    bindTapSwitchExact() {
        this.setData({noMeasure: !this.data.noMeasure});
    },

    async onGetUserInfoEvent(e) {
        const {detail: {userInfo, encryptedData, iv}} = e;
        if (!!userInfo) {
            Toast.showLoading();
            try {
                await Login.doRegister({userInfo, encryptedData, iv});
                const userInfo = await UserInfo.get();
                this.setData({userInfo, showGuide: false});
                Toast.hiddenLoading();
            } catch (e) {
                Toast.warn('获取信息失败');
            }
        }
    },


    onReady() {
        Circular.createSelectorQuery();
    },

    bindScrollView(e) {
        console.log(e.detail.scrollLeft);
        clearTimeout(this.data.timer);
        this.data.timer = '';
        const scrollLeft = e.detail.scrollLeft;
        let that = this;
        let project = this.data.project;
        if (scrollLeft < 130) {
            this.data.timer = setTimeout(function () {
                that.setData({
                    scrollLeft: 0,
                    schemaId: project[0].id
                })
            }, 300)
        } else if (scrollLeft >= 130 && scrollLeft < 340) {
            this.data.timer = setTimeout(function () {
                that.setData({
                    scrollLeft: 490,
                    schemaId: project[1].id
                })
            }, 300)
        } else {
            this.data.timer = setTimeout(function () {
                that.setData({
                    scrollLeft: 1400,
                    schemaId: project[2].id
                })
            }, 300)
        }
    },
    //去完成按钮
    bindTapToFinish(e) {
        const {currentTarget: {dataset: {type}}} = e;
        switch (type) {
            case 'fatBurn':
                HiNavigator.relaunchToIndex();
                break
            case 'bodyIndex':
                this.showModal();
                break
            case 'sport':
                HiNavigator.navigateToFreeClock();
                break
        }
    },

    async bindTapProject(e) {
        this.data.schemaId = e.currentTarget.dataset.index
    },

    onShow() {
        console.log("000111")
        this.handleBle();
        let that = this;
        //进入页面 告知蓝牙标志位 0x3D   0X01 可以同步数据
        app.bLEManager.sendISpage({isSuccess: true});
        app.onDataSyncListener = ({num, countNum}) => {
            console.log('同步离线数据：', num, countNum);
            if (num > 0 && countNum > 0) {
                that.data.sync.num = num;
                that.data.sync.countNum = countNum;
                if (that.data.sync.countNum >= that.data.sync.num) {
                    that.setData({
                        sync: that.data.sync,
                        showBigTip: true
                    });

                    clearTimeout(that.data.sync.timer);
                    that.data.sync.timer = '';
                    that.data.sync.timer = setTimeout(function () {
                        that.handleTasks();
                        that.setData({
                            showBigTip: false
                        });
                    }, 2000)
                }
            } else {
                that.setData({
                    showBigTip: false
                })
            }
        };
        if(this.data.isfinishedGuide){
            that.handleTasks();
        }

    },

    onHide() {
        //离开时 告知蓝牙标志位 0x3D   0X02
        app.bLEManager.sendISpage({isSuccess: false});
    },

    bindTapToResultPage() {
        if (this.data.fatBurnFin) {
            const {fatText, fatTextEn, fatDes, score} = this.data;
            console.log(fatText, fatTextEn, fatDes, score)
            HiNavigator.navigateToResult({fatText, fatTextEn, fatDes, score});
        }
    },
    bindTapToFood(){
        if (this.data.bodyIndexFin) {
            HiNavigator.navigateTofood();
        }
    },
    bindWeightInput(e){
        const weightNumber = e.detail.value.split(".");
        console.log('eeeee',weightNumber[1])
        if(weightNumber[1]>9 ||weightNumber[1] === "0"){
            return tools.subStringNum(e.detail.value)
        }
        if(weightNumber.length>2){
            return parseInt(e.detail.value);
        }
    },
    //轮播图当前
    swiperChange: function (e) {
        console.log(e.detail.current,'eeeeee')
        if(e.detail.current === 0){
            this.setData({
                grayLeft: true,
                grayRight: false
            })
        }
        if(e.detail.current === this.data.sportExt.recommendList.length-1){
            this.setData({
                grayLeft: false,
                grayRight: true
            })
        }
        this.setData({
            currentSwiper: e.detail.current
        })
    },
    //运动打卡--左按钮
    imgToPre(){
        this.setData({
            currentSwiper: this.data.currentSwiper-1
        })
    },
    //运动打卡--右按钮
    imgToNext(){
        this.setData({
            currentSwiper: this.data.currentSwiper+1
        })
    },
    showModal: function () {
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease-in-out",
            delay: 0
        })
        this.animation = animation
        animation.translateY(500).step()
        this.setData({
            animationData: animation.export(),
            showModalStatus: true
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },
    hideModal: function () {
        this.setData({
            showModalStatus: false,
        })
    }
})
