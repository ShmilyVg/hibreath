//index.js
//获取应用实例
import Login from "../../modules/network/login";
import UserInfo from "../../modules/network/userInfo";
import Toast from "../../view/toast";
import HiNavigator from "../../navigator/hi-navigator";

Page({
    data: {
        userInfo: {},
        box3State :["unjoin","join","join-done","ready"],
        box4State :["home-heart-box4-start","home-heart-box4-done","home-heart-box4-num"],

    },
    stateObj:{
      unbind () {
          this.setData({
              message: '未绑定设备',
              state:'点击绑定设备',
              hint: '燃脂小贴士：',
              stateSel: false,
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
              state:'点击重试',
              hint: '燃脂小贴士：',
              stateSel: false,
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
               stateSel: false,
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
                stateSel: true,
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
                hint: '燃脂小贴士：',
                stateSel: true,
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
                stateSel: true,
                setShow: false,
                unitShow: true,
                pointShow: true,
                btnShow:false,
                box3StateIndex:3,
                box4StateIndex:2
            })
        },
        blowdone(){
            HiNavigator.navigateTo({url:'/pages/result/result'});
        }
    },

    useUrl(){
        HiNavigator.navigateTo({url:'/pages/strategy/strategy'});
    },

    historyUrl(){
        HiNavigator.navigateTo({url:'/pages/history/history'});
    },

    onLoad() {
        setTimeout(() => {
            this.stateObj.binding.call(this);
        }, 3000);

    },

    onGetUserInfoEvent(e) {
        console.log(e);
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
