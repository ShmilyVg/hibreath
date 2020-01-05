import Protocol from "../../modules/network/protocol";
import {
  Toast
} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";

Page({
  data: {
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
    btnAble:true
  },

  async onLoad(options) {
    console.log(options);

  },
  bindTapHealth(e) {
    let disease = this.data.disease;
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
      'disease': disease,
    });
    this.checkEmpty();
  },
  checkEmpty() {
    let disease = this.data.disease;
    let check = disease.filter(function(el) {
      return el.isChose == true
    })
    this.setData({
      btnAble: !!check.length
    });
  },
  saveHabitEvent() {
    // for(let item of  this.data.disease)
    const disease = this.data.disease, selectedItems = disease.filter(item => item.isChose).map(item => item.value);
    if (this.data.btnAble) {
      getApp().globalData.tempValue.foodHabitArray = selectedItems;
      HiNavigator.navigateBack({
        delta: 1
      });
    } else {
      Toast.showText('请至少选择一项');
    }
  }
});