// pages/guidance/guidance.js
import {
  Toast as toast,
  Toast,
  WXDialog
} from "heheda-common-view";
import {
  oneDigit
} from "../food/manager";
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
Page({
  data: {
    guidance: {
      page: 0,
      portraitUrl: '',
      info: {
        height: 175,
        weight: 80,
        birthday: '1980-01-01',
        sex: 0,
        illnessType: ['none']
      },
      sexBox: [{
          image: "man",
          text: "男士",
          isChose: false,
          value: 1
        },
        {
          image: "woman",
          text: "女士",
          isChose: true,
          value: 0
        }
      ],
      birth: ["1980", "1", "1"],
      disease: [{
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
      btnAble: true
    }

  },
  objIsEmpty(obj) {
    return typeof obj === "undefined" || obj === "" || obj === null;
  },
  goNextPage() {
    this.setData({
      'guidance.page': ++this.data.guidance.page
    });
  },
  //性别
  bindTapSex(e) {
    let choseIndex = e.currentTarget.dataset.index,
      postSex = 0,
      sexStr = "";
    this.data.guidance.sexBox.map((value, index) => {
      value.isChose = choseIndex == index;
      if (value.isChose) {
        postSex = value.value;
        sexStr = value.image;
      }
    });
    this.setData({
      'guidance.sexBox': this.data.guidance.sexBox,
      "guidance.info.sex": postSex,
      "guidance.info.sexStr": sexStr
    });
  },
  async continueFun() {
    const info = this.data.guidance.info;
    let page = this.data.guidance.page;
    switch (page) {
      case 1:
        if (this.objIsEmpty(info.sex)) {
          toast.warn("请选择性别");
          return;
        }
        break;
      case 2:
        break;
      case 3:
        if (this.objIsEmpty(info.height)) {
          toast.warn("请填写身高");
          return;
        } else if (this.objIsEmpty(info.weight)) {
          toast.warn("请填写体重");
          return;
        }
        break;
      case 4:
        if (!this.data.guidance.btnAble) {
          toast.warn("请至少选择一项");
          return;
        }
        this.postGuidance();
        return;
    }
    if (page != 2) {
      this.goNextPage()
    } else {
      Toast.showLoading();
      this.markSurePicker();
    }
  },
  markSurePicker(){
    setTimeout(() => {
      let pickerObj = this.selectComponent("#pickerDate")
      const startTime = pickerObj.getDateStart();
      const scrollTip = pickerObj.data.scrollTip;
      if (scrollTip) {
        this.setData({
          'guidance.info.birthday': startTime,
          'guidance.birth': startTime.split('-'),
        });
        Toast.hiddenLoading();
        this.goNextPage()
      }else{
        this.markSurePicker()
      }
    }, 200)
  },
  back() {
    this.setData({
      'guidance.page': --this.data.guidance.page
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      reset: options.reset
    })
    this.getUserInfo()
  },
  async getUserInfo() {
    const {
      result
    } = await Protocol.getAccountInfo()
    this.setData({
      'guidance.portraitUrl': result.portraitUrl
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //出生日期
  showBirth(e) {
    this.setData({
      "guidance.info.birthday": e.detail
    });
  },
  //身高
  bindInputHeight(e) {
    const height = e.detail.value;
    let weightGoal = (height / 100) * (height / 100) * 21;
    weightGoal = weightGoal.toFixed(1);
    this.setData({
      "guidance.info.height": Number(height),
      "guidance.info.weightGoal": weightGoal
    });
  },
  //体重
  bindInputWeight(e) {
    this.setData({
      "guidance.info.weight": Number(e.detail.value)
    });
    return oneDigit(e);
  },
  //健康状况
  bindTapHealth(e) {
    let disease = this.data.guidance.disease;
    let choseIndex = e.currentTarget.dataset['index'];
    let isChose = disease[4].isChose;
    if (choseIndex == 4) {
      if (isChose) {
        disease[4].isChose = false;
      } else {
        disease.map((value, index) => {
          if (index != 4) {
            value.isChose = false
          } else {
            value.isChose = true
          }
        });
      }
    } else {
      disease[4].isChose = false;
      disease.map((value, index) => {
        if (index == choseIndex) {
          value.isChose = !value.isChose
        }
      });
    }
    let illnessType = [];
    for (let item of disease) {
      if (item.isChose) {
        illnessType.push(item.value)
      }
    }
    this.setData({
      'guidance.disease': disease,
      'guidance.info.illnessType': illnessType
    });
    this.checkEmpty();
  },
  //完成按钮是否可用
  checkEmpty() {
    let disease = this.data.guidance.disease;
    let check = disease.filter(function(el) {
      return el.isChose == true
    })
    this.setData({
      'guidance.btnAble': !!check.length
    });
  },
  //保存
  async postGuidance() {
    let data = this.data.guidance.info;
    Toast.showLoading('正在生成')
    let result = await Protocol.postGuidance(data);
    Toast.hiddenLoading();
    if (result.code) {
      Toast.success('生成成功');
      HiNavigator.navigateToRecomTar()
    }
  },
  onHide() {
    let guidance = this.data.guidance
    wx.setStorage({
      key: "guidance",
      data: guidance
    })
  },
  getParams: function(a) {
    return wx.getStorageSync(a)
  },
  onShow() {
    let guidance = this.getParams('guidance');
    if (guidance) {
      if (this.data.reset){
        guidance.page =0
      }
      this.setData({
        guidance: guidance
      });
    }
  }
})