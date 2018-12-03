//index.js
//获取应用实例
import Login from "../../modules/network/login";
import UserInfo from "../../modules/network/userInfo";
import Toast from "../../view/toast";
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";


import * as tools from "../../utils/tools";
import ConnectionManager from "./connection-manager";
import BlowManager from "./blow-manager";
import HiBreathBlueToothManager from "../../modules/bluetooth/hi-breath-bluetooth-manager";

Page({
    data: {
        userInfo: {},
        box3State :["unjoin","join","join-done","ready"],
        box4State :["home-heart-box4-start","home-heart-box4-done","home-heart-box4-num"],
        firstInto:true,
        noteListMore:'跑步消耗热量比骑车高，消耗脂肪比骑车高，脂肪消耗比率也比骑车高。这也就意味着某种程度上，跑步在减肥效果方面全面好于骑车。'
    },
    /*stateObj:{
      unbind () {
          this.setData({
              state: "unbind",
              message: '未绑定设备',
              stateBtn:'点击绑定设备',
              hint: '燃脂小贴士：',
              note: this.data.noteListMore,
              stateBtnShow: true,
              setShow: false,
              unitShow: false,
              pointShow: true,
              btnShow:true,
              box3StateIndex:0,
              box4StateIndex:0
          })
      },
      againbind () {
          this.setData({
              message: '未连接到设备',
              stateBtn:'点击重试',
              hint: '燃脂小贴士：',
              note: this.data.noteListMore,
              stateBtnShow: true,
              setShow: true,
              unitShow: false,
              pointShow: true,
              btnShow:true,
              box3StateIndex:0,
              box4StateIndex:0
          })
      },
       binding (){
           this.setData({
               message: '正在连接设备',
               state:' ',
               hint: '燃脂小贴士：',
               note: this.data.noteListMore,
               stateBtnShow: false,
               setShow: true,
               unitShow: false,
               pointShow: true,
               btnShow:true,
               box3StateIndex:1,
               box4StateIndex:0
           })
       } ,
        donebind (){
            this.setData({
                message: '已连接',
                state:'短按设备按键开始检测',
                hint: '燃脂小贴士：',
                note: this.data.noteListMore,
                stateBtnShow: false,
                setShow: true,
                unitShow: false,
                pointShow: true,
                btnShow:true,
                box3StateIndex:2,
                box4StateIndex:1
            })
        },
        unblow(){
            this.setData({
                message: '0',
                state:'预热中',
                hint: '',
                note: '',
                stateBtnShow: false,
                setShow: false,
                unitShow: true,
                pointShow: false,
                btnShow:false,
                box3StateIndex:3,
                box4StateIndex:2
            })
        },
        blowing(){
            this.setData({
                message: '0',
                state:'请现在对准吹气口吹气',
                hint: '吹气要领：',
                note: '吹气时用一口气吹，吹速缓慢，中间不换气，听到滴声后即可停止。',
                stateBtnShow: false,
                setShow: false,
                unitShow: true,
                pointShow: true,
                btnShow:false,
                box3StateIndex:3,
                box4StateIndex:2,

            })
        },
        blowdone(){
            HiNavigator.navigateTo({url:'/pages/result/result'});
        }
    },*/

    useUrl() {
        HiNavigator.navigatorToStrategy();
    },

    historyUrl(){
        HiNavigator.navigateTo({url:'/pages/history/history'});
    },

    stateBtnClick(){

    },

    onLoad() {
        /*setTimeout(() => {
            this.stateObj.donebind.call(this);
        }, 3000);*/
        this.connectionPage = new ConnectionManager(this);
        this.connectionPage['connecting']();
        this.blowPage = new BlowManager(this);
        this.blowPage.ready();
        this.bleManager = new HiBreathBlueToothManager();
        this.bleManager.setBLEListener({
            bleStateListener: ({state}) => {
                this.connectionPage[state]();

            }})
        getApp().onGetUserInfo = ({userInfo})=>this.setData({userInfo});
        let info = getApp().globalData.userInfo;
        if (info) {
            this.setData({
                userInfo: info
            })
        }
        if (this.data.firstInto) {
            Protocol.getAnalysisNotes({}).then(data => {
                let noteList = data.result.list;

                this.setData({
                    noteList: noteList,
                    firstInto:false
                })
                this.handleTipText();
            });
        }
        Protocol.getDeviceBindList({}).then(data => {
            let bindList = data.result;
            if(bindList.length == 0){
                this.connectionPage.unBind();
            }
            console.log(bindList)
        })


    },

    onShow(){
        if (!this.data.firstInto) {
            this.handleTipText();
        }
    },

    handleTipText(){
        let noteListNum = Math.round(Math.random() * (this.data.noteList.length - 1));
        let noteListMore = this.data.noteList[noteListNum]['text_zh'];
        this.setData({
            noteListMore:noteListMore
        })
        console.log(noteListMore)
    },

    onGetUserInfoEvent(e) {
        Toast.showLoading();
        const {detail: {userInfo, encryptedData, iv}} = e;
        Login.doRegister({
            userInfo,
            encryptedData,
            iv
        })
            .then(() => UserInfo.get())
            .then(({userInfo}) => this.setData({userInfo}))
            .catch(() => setTimeout(Toast.warn, 0, '获取信息失败')).finally(Toast.hiddenLoading);

    }

});
