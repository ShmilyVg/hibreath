import Protocol from "../../modules/network/protocol";
import {
  chooseImage,
  entries,
  uploadFile
} from "./manager";
import {
  Toast as toast,
  Toast,
  WXDialog
} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";
import {
  whenDismissGroup
} from "../../pages/community/social-manager";

Page({


  data: {
    endYear: '',
    originUserInfo: {
      nickname: '',
      portraitUrl: '',
      sex: -1,
      height: 0,
      weight: 0,
      birthday: '',
      bodyFatRate: null,
      
    },
    checkKeys: ['height', 'weight','sex'],
    illness: [{
        text: '三高（高血压、高血糖、高血脂）',
        value: 'sangao',
        isChose: false,
      },
      {
        text: '胃病（慢性胃炎，胃溃疡）',
        value: 'weibing',
        isChose: false,
      },
      {
        text: '消化、代谢病（痛风、胆囊炎、胆结石）',
        value: 'daixie',
        isChose: false,
      },
      {
        text: '其他已确诊疾病',
        value: 'all',
        isChose: false,
      },
      {
        text: '我很健康，以上都没有',
        value: 'none',
        isChose: true,
      },
    ],
    editUserInfo: {},
    mealTypeString: '请输入',
    showToastTxt:{
      nickname:'请填写昵称',
      portraitUrl:'请填写头像信息',
      sex: '请填写性别信息',
      height: '请填写身高',
      weight: '体重必填且不小于40KG',
      birthday: '请填写生日信息',
      // illnessType: '请填写身体状况信息'
    },
    replenish:''
  },


  async onLoad(options) {
    const {
      result: {
        nickname,
        portraitUrl,
        sex,
        height,
        weight,
        birthday,
      }
    } = await Protocol.getUserDetailInfo();
    const now = new Date();
    let birthdayStr = "";
    if (birthday) {
      birthdayStr = birthday.split('-').map(item => item.padStart(2, '0')).join('-')
    }
    this.setData({
      endYear: [now.getFullYear() -17, 12, 31].map(item => item.toString().padStart(2, '0')).join('-'),
      originUserInfo: {
        nickname,
        portraitUrl,
        sex,
        height,
        weight,
        birthday: birthdayStr,
      }
    });
  },

  onShow() {
  },

  showMealType(illnessType) {
    if (illnessType) {
      let mealTypeString = this.data.illness.filter(habit => {
        for (const item of illnessType) {
          if (habit.value === item) {
            return true;
          }
        }
        return false;
      }).map(item => item.text).join(' ') || '请输入';
      mealTypeString = mealTypeString.length > 11 ? mealTypeString.slice(0, 11)+'...' : mealTypeString;
      this.setData({
        mealTypeString: mealTypeString
      });
    }
  },

  async saveUserInfo({
    detail: {
      value: values
    }
  }) {
    const obj = {};
    let editUserInfo = this.data.editUserInfo;
    let originUserInfo = this.data.originUserInfo;
    let checkKeys = this.data.checkKeys;
    let info_change = false;
    for (const [key, value] of entries(values)) {
      if (value !== undefined && value !== "" && value !== null) {
        obj[key] = value;
      }
    }
    const finalEditUserInfoObj = { ...editUserInfo,
        ...obj
      },
      finalUserInfoObj = { ...originUserInfo,
        ...finalEditUserInfoObj
      };
    
    for (let item of checkKeys){
      if (originUserInfo[item] != finalEditUserInfoObj[item]){
        info_change = true;
      }
    }
    if (this.checkFill(finalUserInfoObj)) {
      await whenDismissGroup(Protocol.postMembersPutInfo(finalEditUserInfoObj));
      Toast.success('保存成功');
      if (info_change){
        WXDialog.showDialog({
          content: "您的资料已发生变化，需要更新减脂计划",
          showCancel: true,
          confirmText: "立即前往",
          cancelText: "取消",
          confirmEvent: () => {
            //
            HiNavigator.navigateToWeightTarget(2);
          },
          cancelEvent: () => { 
            HiNavigator.navigateBack({
              delta: 1
            });
          }
        });
      }else{
        HiNavigator.navigateBack({
          delta: 1
        });
      }
      
    } else {
      let showToastTxt = this.data.showToastTxt;
      wx.showToast({
        title: showToastTxt[this.data.replenish] ,
        icon: 'none',
        duration: 2000
      });
      // toast.showText('请完善所有信息');
    }
  },
  setReplenish(key){
    this.setData({
      replenish:key
    })
  },
  checkFill(finalUserInfoObj) {
    for (const [key, value] of entries(finalUserInfoObj)) {
      if (!value) {
        if (key !== 'sex') {
          this.setReplenish(key)
          return false;
        } else if (value == null){
          this.setReplenish(key)
          return false;
        } 
      } else if (key == 'weight' && value < 40) {
        this.setReplenish(key)
        return false;
      }else{
        if (Array.isArray(value) && !value.length) {
          this.setReplenish(key)
          return false;
        }
      }
    }
    return true;
  },
  async uploadHeadEvent() {
    const filePath = await chooseImage(),
      portraitUrl = await uploadFile({
        filePath
      });
    this.setData({
      'editUserInfo.portraitUrl': portraitUrl
    });
  },

  bindSexPickerChange({
    detail: {
      value
    }
  }) {
    console.log(value);
    this.setData({
      'editUserInfo.sex': parseInt(value)
    });
  },

  bindBirthdayPickerChange({
    detail: {
      value
    }
  }) {
    console.log(value);
    this.setData({
      'editUserInfo.birthday': value
    });
  }

});