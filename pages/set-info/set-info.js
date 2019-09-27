// pages/set-info/set-info.js
import toast from "../../view/toast";
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
import WXDialog from "../../view/dialog";
import IndexCommonManager from "../index/view/indexCommon";
import {ProtocolState} from "../../modules/bluetooth/bluetooth-state";
import HiNavigator from "../../navigator/hi-navigator";
import Login from "../../modules/network/login";
import UserInfo from "../../modules/network/userInfo";
import {Toast} from "heheda-common-view";
import * as Circular from "../result/view/circular";

const app = getApp();

Page({
    data: {
        showGuide: false,
        showNewInfo: false,
        noMeasure: false,//没有准确测过体脂率
        sexBox: [
            {image: 'man', text: '男士', isChose: false, value: 1},
            {image: 'woman', text: '女士', isChose: true, value: 0}
        ],
        currentDate: '2018-12-19',
        page: 1,
        title: ['减脂目标', '性别', '出生日期', '身高体重', '体脂率', '您的三餐选择', '推荐目标体重', '选择一套方案'],
        page4MenItem: ['3-4', '6-7', '10-12', '15', '20', '25', '30', '35', '40'],
        page4WomenItem: ['10-12', '15-17', '20-22', '25', '30', '35', '40', '45', '50'],
        birth: ['1980', '01', '01'],
        meals: [
            {text: '外卖为主', isChose: false, en: 'waimai'},
            {text: '外出就餐为主', isChose: false, en: 'waichu'},
            {text: '单位食堂为主', isChose: false, en: 'shitang'}
        ],
        bgColor: '#ffffff',
        score: 6.5,
        showBigTip: false,
        schemaId: 0,
        scrollLeft: 490,
        timer: ''
    },

    onLoad() {
        let that = this;
        wx.getSetting({
            success: (res) => {
                console.log('是否授权', res.authSetting['scope.userInfo'] !== undefined);
                if (res.authSetting['scope.userInfo'] === undefined) {
                    that.setData({
                        showGuide: true,
                        showNewInfo: true
                    })
                } else {
                    that.setData({
                        showGuide: false,
                        showNewInfo: false
                    })
                }
            }
        });
        this.handleBaseInfo();
        Circular.init(this);
    },

    async handleBaseInfo() {
        const {year, month, day} = tools.createDateAndTime(Date.parse(new Date()));
        const currentDate = `${year}-${month}-${day}`;
        const {result: {list: goals}} = await Protocol.postSettingsGoals();
        const {result: accountInfo} = await Protocol.getAccountInfo();
        const finishedGuide = accountInfo.finishedGuide;
        let info = {};
        if (accountInfo.detail) {
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
            this.setData({
                currentDate, goals, finishedGuide, info,
                birth: this.data.birth,
                meals: this.data.meals,
                sexBox: this.data.sexBox,
                showNewInfo: true,
                bgColor: '#ffffff'
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
        const isBindDevice = wx.getStorageSync('isBindDevice');
        if (isBindDevice) {
            app.getBLEManager().connect();
        }
    },

    async handleTasks() {
        const {result} = await Protocol.postMembersTasks();
        const quan = result.taskList[0].ext;
        console.log('quan:', quan);
        this.setData({
            taskRes: result,
            fatText: quan.des.zhCh,
            fatTextEn: quan.des.en,
            score: quan.dataValue,
            fatDes: quan.visDes,
            showNewInfo: false,
            bgColor: '#FEF6F2'
        });

        Circular.run();

        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#F55E6B',
            animation: {
                duration: 400,
                timingFunc: 'easeIn'
            }
        })
    },

    async continue() {
        const info = this.data.info;
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
                        if (!num[1] || num[1] >= 10) {
                            this.showDialog("请精确到小数点后一位");
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
                await Protocol.postMembersPut(this.data.info);
                const {result: {list: project}} = await Protocol.postSettingsLosefatSchema();
                this.setData({project});
                break;
            case 8:
                await Protocol.postMembersJoinSchema({schemaId: this.data.schemaId});
                this.handleTasks();
                return;
        }
        this.setData({
            page: ++this.data.page,
        });
    },

    objIsEmpty(obj) {
        return (typeof (obj) === "undefined" || obj === "");
    },

    showDialog(content) {
        WXDialog.showDialog({title: '小贴士', content, confirmText: '我知道了'});
    },

    back() {
        this.setData({
            page: --this.data.page
        })
    },

    //BIND
    bindInputGoal(e) {
        this.setData({'info.goalDesc': e.detail.value})
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
    },

    bindInputWeightGoal(e) {
        this.setData({'info.weightGoal': e.detail.value});
    },

    bindInputExact(e) {
        this.setData({'info.bodyFatRate': e.detail.value})
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

    scrolltoupper(e) {
        console.log('scrolltoupper:', e);
    },

    bindTapToFinish(e) {
        console.log(e);
        const {currentTarget: {dataset: {type}}} = e;
        switch (type) {
            case 'test':
                const isBindDevice = wx.getStorageSync('isBindDevice');
                if (isBindDevice) {
                    this.setData({
                        showBigTip: true
                    });
                } else {
                    HiNavigator.relaunchToIndex();
                }
                break
        }
    },

    async bindTapProject(e) {
        this.data.schemaId = e.currentTarget.dataset.index
    },

    onShow() {
        this.handleBle();
        //进入页面 告知蓝牙标志位 0x3D   0X01 可以同步数据
        app.bLEManager.sendISpage({isSuccess: true});
    },

    onHide() {
        //离开时 告知蓝牙标志位 0x3D   0X02
        app.bLEManager.sendISpage({isSuccess: false});
    },

    toResultPage() {
        const {fatText, fatTextEn, fatDes, score} = this.data;
        HiNavigator.navigateToResult({fatText, fatTextEn, fatDes, score});
    }
})
