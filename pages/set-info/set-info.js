// pages/set-info/set-info.js
/**
 * @Date: 2019-10-09 11:00:00
 * @LastEditors: 张浩玉
 */
import {Toast as toast, Toast, WXDialog} from "heheda-common-view";
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
import IndexCommonManager from "../index/view/indexCommon";
import HiNavigator from "../../navigator/hi-navigator";
import Login from "../../modules/network/login";
import UserInfo from "../../modules/network/userInfo";

import ConnectionManager from "../index/connection-manager";
import {oneDigit} from "../food/manager";
import {ConnectState} from "../../modules/bluetooth/bluetooth-state";
import {showActionSheet} from "../../view/view";
import {judgeGroupEmpty, whenDismissGroup} from "../community/social-manager";
import * as Shared from "./view/shared.js";
import {UploadUrl} from "../../utils/config";
const app = getApp();
Page({
    data: {
        isfatBurn: false,//燃脂卡片
        isbodyIndex: false,//记录身体指标卡片

        showGuide: false,//立即体验 未注册状态
        showNewInfo: false,//新手引导页

        noMeasure: false,//没有准确测过体脂率
        sexBox: [
            {image: 'man', text: '男士', isChose: false, value: 1},
            {image: 'woman', text: '女士', isChose: true, value: 0}
        ],
        currentDate: '2018-12-19',
        page: 1,
        title: ['减脂目标', '性别', '出生日期', '身高体重', '体脂率', '是否有条件自己做饭', '推荐目标体重', '选择一套方案'],
        page4MenItem: ['4', '7', '10', '15', '20', '25', '30', '35', '40'],
        page4WomenItem: ['10', '15', '20', '25', '30', '35', '40', '45', '50'],
        birth: ['1980', '1', '1'],
      /*  meals: [
            {text: '外卖为主', isChose: false, en: 'waimai'},
            {text: '外出就餐为主', isChose: false, en: 'waichu'},
            {text: '单位食堂为主', isChose: false, en: 'shitang'},
            {text: '居家制作为主', isChose: false, en: 'jujia'}
        ],*/
        meals:[],
        secArray:[],
        bgColorSetInfoPage: '#ffffff',
        score: 0,
        showBigTip: false,
        schemaId: 0,
        scrollLeft: 490,
        timer: '',
        _timeoutIndex:'',
        bigTipNum: 0,
        bigTipCountNum: 20,
        sync: {
            num: 0,
            countNum: 0,//需要同步的总数
            timer: ''
        },
        phValue: "写下你的减脂目标",
        bloodLow: "",
        heart: "",
        bloodHeight: "",
        weight: "",
        taskId: "",
        showModalStatus: false,
        animationData: '',
        isfinishedGuide: false,//是否选择了方案
        hiddenImg: false,//隐藏左右箭头
        grayLeft: true,//灰色箭头左
        grayRight: false,//灰色箭头右
        currentSwiper: 0,
        isFood:false,
        fatText:'',
        fatTextEn:'',
        fatType:'',
        fatDes:'',


        shareDown:"../../images/set-info/shareDown.png",
        shareUp:"../../images/set-info/shareUp.png",
        shareTotalDif:"",
        shareFat:"",
        shareFatBurnDesc:"",
        shareTaskList:"",
        shareTaskListImg0:"",
        shareTaskListImg1:"",
        shareTaskListImg2:"",
        shareTaskListImg3:"",
        shareImg:"",
        bgImg:"../../images/set-info/shareBg.png",//分享背景
        textBg:'../../images/set-info/textBg.png',
        //shareTextList:['分享给好友或群']
    },
    onFocus: function (e) {
        this.setData({
            isFocus: true,
            phValue: "写下你的减脂目标",
        })
    },
    onBlur: function (e) {
        this.setData({
            isFocus: false,
            phValue: "写下你的减脂目标",
        })
    },

    onHide() {
        //离开时 告知蓝牙标志位 0x3D   0X02
        if(app.getLatestBLEState().connectState ==='connected'){
            app.bLEManager.sendISpage({isSuccess: false});
        }
        console.log('breath_user_info_input onHide info====', this.data.info);
        if (this.data.info) {
            let {info, page, scrollLeft, schemaId} = this.data, obj = {};
            for (let key in info) {
                if (info.hasOwnProperty(key)) {
                    let item = info[key];
                    if (item) {
                        obj[key] = item;
                    }
                }
            }
            if (info['sex'] === 0) {
                obj['sex'] = 0;
                obj['sexStr'] = 'woman';
            }
            obj['page'] = page;
            if (page >= 8) {
                obj['scrollLeft'] = scrollLeft;
                obj['schemaId'] = schemaId;
            }
            wx.setStorageSync('breath_user_info_input', obj);
        }

    },

    //上传身体指标
    formSubmit(e) {
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
        if (finaValue.heart) {
            const heartnum = finaValue.heart.split(".");
            if (heartnum.length > 1 || heartnum[0] >= 1000) {
                this.showDialog("心率至多支持3位整数");
                return;
            }
        }
        if (finaValue.bloodHeight) {
            const bloodHeightnum = finaValue.bloodHeight.split(".");
            if (bloodHeightnum.length > 1 || bloodHeightnum[0] >= 1000) {
                this.showDialog("高压至多支持3位整数");
                return;
            }
        }
        if (finaValue.bloodHeight && !finaValue.bloodLow) {
            this.showDialog("请输入低压");
            return;
        }
        if (finaValue.bloodLow && !finaValue.bloodHeight) {
            this.showDialog("请输入高压");
            return;
        }
        if (finaValue.bloodLow) {
            const bloodLownum = finaValue.bloodLow.split(".");
            if (bloodLownum.length > 1 || bloodLownum[0] >= 1000) {
                this.showDialog("低压至多支持3位整数");
                return;
            }
        }
        finaValue['taskId'] = this.data.taskId
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
        let that = this;
        console.log('on:', e);
        if (e.isNotRegister) {
            that.setData({
                isNotRegister: e.isNotRegister,
                showNewInfo: true,
                showGuide: true
            })

        }
        this.connectionPage = new ConnectionManager(this);
        /* await that.handleGuide(that);*/
        this.handleBaseInfo();
        console.log("this",this)

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
    async handleBaseInfo(resetPage) {
        const {year, month, day} = tools.createDateAndTime(Date.parse(new Date()));
        const currentDate = `${year}-${month}-${day}`;
        //获取三餐选择方案
        const {result: {list}} = await Protocol.postMealType();
        this.setData({
            meals:list
        })
        const {result: {list: goals}} = await Protocol.postSettingsGoals();
        const {result: accountInfo} = await Protocol.getAccountInfo();
        const finishedGuide = accountInfo.finishedGuide;

        this.setData({
            isfinishedGuide: finishedGuide
        });
        let info = {};

        function setSexFun(sexValue) {
            if (sexValue !== 1) {
                info.sex = 0;
                info.sexStr = 'woman';
            } else {
                info.sex = 1;
                info.sexStr = 'man';
            }

            for (let item of this.data.sexBox) {
                item.isChose = item.value === sexValue;
            }
        }
        if (finishedGuide) {
            this.handleTasks();
        } else {

            info = {
                goalDesc: '',
                sex: 0,
                sexStr: 'woman',
                birthday: '1980-1-1',
                height: '',
                weight: '',
                bodyFatRate: '',
                weightGoal: '',
            };
            accountInfo.detail && ({detail: {sex: info.sex}} = accountInfo);

            const userInfoInput = wx.getStorageSync('breath_user_info_input');
            console.log('breath_user_info_input handleBaseInfo() data====', userInfoInput);
            let page = resetPage||1, project = [];
            if (userInfoInput) {
                info = Object.assign(info, userInfoInput);
                page = resetPage || userInfoInput.page || 1;

                const mealValue = info.mealType;
                for (let item of this.data.meals) {
                    item.isChose = mealValue === item.en;
                }
                const {birthday} = info;
                if (birthday) {
                    this.data.birth = birthday.split('-');
                }
                if (page >= 8) {
                    const {result: {list}} = await Protocol.postSettingsLosefatSchema();
                    project.push(...list);
                  console.log(456,project)
                }

            }
            setSexFun.call(this, info.sex);
            let obj = {
                currentDate, goals, info,
                showNewInfo: true,
                showGuide: false,
                birth: this.data.birth,
                meals: this.data.meals,
                sexBox: this.data.sexBox,
                bgColorSetInfoPage: '#ffffff',
                page,
            };
            if (project.length) {
                obj['project'] = project;
                obj['scrollLeft'] = info.scrollLeft;
                obj['schemaId'] = info.schemaId;
            }
            this.setData(obj);
        }
    },

    handleBle() {
        this.indexCommonManager = new IndexCommonManager(this);
        app.setBLEListener({
            bleStateListener: () => {
                console.log("setPage-bleStateListener", app.getLatestBLEState())
               /*
                首页提示蓝牙未开启 暂做注释
               if(app.getLatestBLEState().connectState =='unavailable'&&!this.data.showNewInfo&&!this.data.showGuide){
                    console.log(this.data.showNewInfo,this.data.showGuide,'状态值！！！！！！！！！！！！！！！！')
                    setTimeout(() => {
                        WXDialog.showDialog({title: 'TIPS', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了'});
                     },200);
                }*/
               if(app.getLatestBLEState().connectState ==='connected'){
                   app.bLEManager.sendISpage({isSuccess: true});
               }
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
                console.log('app.getLatestBLEState().connectState', app.getLatestBLEState().connectState)
                if(app.getLatestBLEState().connectState !== 'connected'){
                    app.getBLEManager().connect({macId: deviceInfo.mac});
                }
            }
        });
        /*  const isBindDevice = wx.getStorageSync('isBindDevice');
          if (isBindDevice) {
              app.getBLEManager().connect();
          }*/
    },
    async onCommunitySettingClickEvent() {
        try {
            const {tapIndex} = await showActionSheet({itemList: ['退出当前方案'],itemColor:"#ED6F69"});
            switch (tapIndex) {
                case 0:
                    WXDialog.showDialog({
                        content: '确定要退出该方案吗',
                        showCancel: true,
                        confirmText: "确定",
                        cancelText: "取消",
                        confirmEvent: () => {
                            Protocol.postMembersExit({planId:this.data.planId}).then(() =>
                                this.handleBaseInfo(1)
                            )
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
    async handleTasks() {
        Toast.showLoading();
        const {result} = await Protocol.postMembersTasks();
        this.setData({
            planId:result.planId,
            sharedId:result.sharedId,
            indexDayDesc: result.dayDesc,
            indexfinishNum: result.finishNum,
            indexgoalDesc: result.goalDesc,
            indextaskNum: result.taskNum,
            taskListAll: result.taskList,
        })
        if(this.data.sharedId){
            const {result} = await Protocol.postSharetask({sharedId:this.data.sharedId});
            if(result.fatBurn){
                this.setData({
                    shareFat:result.fatBurn,
                    shareFatBurnDesc:result.fatBurnDesc
                })
            }
            this.setData({
                shareTodayDif:result.todayDif,
                shareTotalDif:result.totalDif,
                shareTaskList:result.taskList,
            })
        }
        const typesArr = result.taskList.map(d => d.type)
        console.log("123213", typesArr)
        for (var i = 0; i < typesArr.length; i++) {
            if (typesArr[i] === "fatBurn") {
                const fatBurnExt = result.taskList[i].ext;
                if (result.taskList[i].finished) {
                    this.setData({
                        isfatBurn: true,
                        fatBurnFin: true,//完成标志位
                        fatBurnTask: result.taskList[i],
                        fatText: fatBurnExt.des.zhCh,
                        fatTextEn: fatBurnExt.des.en,
                        score: fatBurnExt.dataValue,
                        fatType:fatBurnExt.iconUrl,
                        bgColorSetInfoPage: '#FEF6F2',
                        fatDes:fatBurnExt.visDes
                    });
                } else {
                    this.setData({
                        isfatBurn: true,
                        fatBurnTask: result.taskList[i],
                        bgColorSetInfoPage: '#FEF6F2'
                    });
                }
            }
            if (typesArr[i] === "bodyIndex") {
                const bodyIndexExt = result.taskList[i].ext;
                console.log(bodyIndexExt, "typesArr[i]")
                if (result.taskList[i].finished) {
                    this.setData({
                        isbodyIndex: true,
                        bodyIndexFin: true,
                        bodyIndexTask: result.taskList[i],
                        bodyIndexExt: bodyIndexExt,
                        taskId: result.taskList[i].id
                    })
                    console.log(bodyIndexExt)
                } else {
                    this.setData({
                        isbodyIndex: true,
                        taskId: result.taskList[i].id,
                        bodyIndexTask: result.taskList[i],
                    })
                }
            }
            if (typesArr[i] === "sport") {
                const sportExt = result.taskList[i].ext;
                if (result.taskList[i].finished) {
                    this.setData({
                        sportFin: true,
                    })
                }
                if(sportExt.recommendList[0].list.length == 1){
                    this.setData({
                        aheight: 230,
                    })
                }else{
                    this.setData({
                        aheight: sportExt.recommendList[0].list.length * 110+205,
                    })
                }
                this.setData({
                    currentSwiper:0,
                    sportTask: result.taskList[i],
                    sportExt: sportExt,
                })
                if (sportExt.recommendList.length < 2) {
                    this.setData({
                        hiddenImg: true,
                    })
                } else {
                    this.setData({
                        hiddenImg: false,
                    })
                }

            }
            if(typesArr[i] === "food"){
                this.component= this.selectComponent('.countdown')
                this.setData({
                    component: this.component,
                })
                const foodExt = result.taskList[i].ext;
                if (result.taskList[i].finished) {
                    this.setData({
                        foodFin: true,
                    })
                }
                if(foodExt.isMeal){
                    if(foodExt.mealList[0].list.length == 1){
                        this.setData({
                            foodAheight: 230,
                        })
                    }else{
                        this.setData({
                            foodAheight: foodExt.mealList[0].list.length * 110+205,
                        })
                    }
                    this.setData({
                        foodcurrentSwiper:0,

                        calorie:this.data.component.sum(foodExt.mealList[0].list,1),
                        carbohydrate:this.data.component.sum(foodExt.mealList[0].list,2),
                        fat:this.data.component.sum(foodExt.mealList[0].list,3),
                        protein:this.data.component.sum(foodExt.mealList[0].list,4)
                    })

                }
                this.setData({
                    foodExt: foodExt,
                    foodTask: result.taskList[i]
                })
                if (foodExt.mealList.length < 2) {
                    this.setData({
                        foodHiddenImg: true,
                    })
                } else {
                    this.setData({
                        foodHiddenImg: false,
                    })
                }
            }
        }

        setTimeout(() => {
            wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#F55E6B',
            })
        });
        Toast.hiddenLoading()
    },

    async continue() {
        const info = this.data.info;
        console.log(info.goalDesc.length, 'info.goalDesc')
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
                console.log('page6',this.data.meals)
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
                this.setData({
                  project: project,
                  schemaId: project[0].id
                  });
                break;
            case 8:
                await Protocol.postMembersJoinSchema({schemaId: this.data.schemaId});
                this.handleTasks();
                this.setData({
                    showNewInfo: false
                })
                return;
        }
        if(this.data.page<8){
            this.setData({
                page: ++this.data.page,
            });
        }

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
        console.log('e.detail.value',e.detail.value)
        this.setData({
            'info.goalDesc': tools.filterEmoji(e.detail.value).trim()
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
    showBirth(e){
        console.log('dddddd',e.detail)
        this.setData({
            'info.birthday': e.detail,
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
        console.log("231", e.detail.value)
        this.setData({'info.weightGoal': e.detail.value});
        return oneDigit(e);
    },

    bindInputExact(e) {
        this.setData({'info.bodyFatRate': e.detail.value})
        return oneDigit(e);
    },
    //三餐选择
    bindTapMealsSecNone(e){
        let choseIndex = e.currentTarget.dataset.index;
        var item = this.data.meals[choseIndex];
        console.log('meals', this.data.meals)
        item.isChose = !item.isChose;
        for(var i=0;i<this.data.meals.length;i++){
            if(this.data.meals[i].en !== 'none'){
                this.data.meals[i].isChose = false
            }
        }
        this.setData({
            meals: this.data.meals,
            secArray:[]
        })
        this.data.secArray.push('none')
        this.setData({
            'info.mealType': this.data.secArray
        });
        console.log('最终结果1',this.data.secArray)
    },
    //数组去重
    unique(arr) {
        return Array.from(new Set(arr))
    },
    bindTapMeals(e) {
        for(var i=0;i<this.data.meals.length;i++){
            if(this.data.meals[i].en == 'none' && this.data.meals[i].isChose == true){
                this.data.meals[i].isChose = false
                this.setData({
                    secArray:[]
                })
            }
        }
        let choseIndex = e.currentTarget.dataset.index;
        var item = this.data.meals[choseIndex];
        console.log('item.isChose == true',item.isChose == true)
        if(item.isChose == true){
            this.data.secArray= this.data.secArray.filter(function(items) {
                     return items != item.en
                 });
        }else{
            this.data.secArray.push(item.en)
        }

        console.log('choseIndex',item)
        item.isChose = !item.isChose;
        this.setData({
            meals: this.data.meals,
            'info.mealType': this.data.secArray
        });
        console.log('最终结果2',this.unique(this.data.secArray))
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
            try {
                Toast.showLoading();
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
    //视频打卡
    toVideoClock(e) {
        console.log("toVideoClock", e.currentTarget)
        if (e.currentTarget.dataset.finid) {
            HiNavigator.navigateToFinishCheck({dataId: e.currentTarget.dataset.finid, clockWay: 'video'});
            return
        }
        HiNavigator.navigateToVideoClock({id: e.currentTarget.dataset.id});
    },
    //去完成按钮
    bindTapToFinish(e) {
        const {currentTarget: {dataset: {type}}} = e;
        switch (type) {
            case 'fatBurn':
                HiNavigator.navigateIndex();
                break
            case 'bodyIndex':
                this.showModal();
               /* HiNavigator.navigateToDeviceUnbind();*/
                break
            case 'sport':
                HiNavigator.navigateToFreeClock();
                break
        }
    },

    async bindTapProject() {
      HiNavigator.navigateToCaseDetails({ schemaId: this.data.schemaId});

    },

    async onShow() {
        this.handleBle();
        let that = this;
        //进入页面 告知蓝牙标志位 0x3D   0X01 可以同步离线数据

        app.onDataSyncListener = ({num, countNum}) => {
            console.log('同步离线数据：', num, countNum);
            if (num > 0 && countNum > 0) {
                that.data.sync.num = num;
                that.data.sync.countNum = countNum;
                if (that.data.sync.countNum >= that.data.sync.num) {
                    that.setData({
                        sync: that.data.sync,
                        showBigTip: true,
                    });

                    clearTimeout(that.data.sync.timer);
                    that.data.sync.timer = '';
                    that.data.sync.timer = setTimeout(function () {
                        that.setData({
                            showBigTip: false,
                        });
                        that.handleTasks();
                    }, 2000)
                }
            } else {
                that.setData({
                    showBigTip: false,
                })
            }
        };
        if(this.data.isfinishedGuide || this.data.isFood){
            that.handleTasks();
        }


    },


    async bindTapToResultPage() {
        if (this.data.fatBurnFin) {
            const {fatText, fatTextEn, fatDes, score} = this.data;
            console.log(fatText, fatTextEn, fatDes, score)
            HiNavigator.navigateToResult({fatText, fatTextEn, fatDes, score});
            /*HiNavigator.navigateToResultNOnum();*/
            return
        }
        let {result: {list:breathList}} = await Protocol.postBreathDatalistAll({
            timeBegin: 1510468206000,
            timeEnd: Date.now()
        });
        if(breathList.length>0){
            HiNavigator.navigateToResultNOnum();
            return
        }
        HiNavigator.navigateIndex();
    },
    async bindTapToFood() {
        if (this.data.bodyIndexFin) {
            HiNavigator.navigateTofood();
            return
        }
        let {result: {list:weightList}}=await Protocol.postWeightDataListAll({
            timeBegin:1510468206000,
            timeEnd:Date.now()
        })
        if(weightList.length>0){
            HiNavigator.navigateTofood();
            return
        }
        this.showModal();
    },
    bindWeightInput(e) {
        const weightNumber = e.detail.value.split(".");
        console.log('eeeee', weightNumber[1])
        if (weightNumber[1] > 9 || weightNumber[1] === "0") {
            return tools.subStringNum(e.detail.value)
        }
        if (weightNumber.length > 2) {
            return parseInt(e.detail.value);
        }
    },
    //选择方案轮播图
    swiperChangeCase(e){
      this.setData({
        schemaId: this.data.project[e.detail.current].id
      })
    },
    //轮播图当前
    swiperChange: function (e) {
        console.log(e.detail.current, 'eeeeee')
        this.setData({
            currentSwiper: e.detail.current,
        })
        if(this.data.sportExt.recommendList[e.detail.current].list.length == 1){
            this.setData({
                aheight: 230,
            })
        }else{
            this.setData({
                aheight: this.data.sportExt.recommendList[e.detail.current].list.length * 110+205,
            })
        }

        if (e.detail.current === 0) {
            this.setData({
                grayLeft: true,
                grayRight: false
            })
            return
        }
        if (e.detail.current === this.data.sportExt.recommendList.length - 1) {
            this.setData({
                grayLeft: false,
                grayRight: true
            })
            return
        }
        this.setData({
            grayLeft: false,
            grayRight: false
        })
    },
    //运动打卡--左按钮
    imgToPre() {
        this.setData({
            currentSwiper: this.data.currentSwiper - 1
        })
    },
    //运动打卡--右按钮
    imgToNext() {
        this.setData({
            currentSwiper: this.data.currentSwiper + 1
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
        this.handleTasks();
    },

    /**
     * 用户点击右上角分享
     */
     onShareAppMessage() {
        console.log('sharedId',this.data.shareImg)
        return {
            title: this.data.indexDayDesc,
            path: '/pages/taskShareInfo/taskShareInfo?sharedId=' + this.data.sharedId,
            imageUrl:this.data.shareImg
        };
        console.log('indexDayDesc',this.data.shareImg)

    },
    listenerButton: function() {
        Toast.showLoading()
        Shared.getImageInfo(this)
        Shared.screenWdith(this)

    },
    listenerActionSheet:function() {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    cancel(){
        this.setData({
            isOpened: false
        })
        wx.showTabBar({
            fail: function () {
                setTimeout(function () {
                    wx.showTabBar()
                }, 500)
            }

        });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
        if(!this.data.showNewInfo&&!this.data.showGuide){
            this.handleTasks()
        }
    }
})
