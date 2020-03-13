// components/taskFinish/taskFinish.js
import HiNavigator from "../../navigator/hi-navigator";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    weightFinish:{
      type:Boolean,
      value:false
    },
    fatFinish:{
      type:Boolean,
      value:false
    }
  },
  lifetimes: {
    created() {

    },
    attached() {

    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    isGreen:false,
    imgList:['fatWindows/nike.png','fatWindows/flash1.png','fatWindows/flash2.png']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    secAgain(){
      this.setData({
        isGreen:!this.data.isGreen
      })
      if(this.data.isGreen){
        wx.setStorageSync('showTaskFinish', false);
      }else{
        wx.setStorageSync('showTaskFinish', true);
      }
    },
    toFat(){
      HiNavigator.switchToSetInfo()
    },
    toWeight(){

    },
  }



})
