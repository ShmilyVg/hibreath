// components/uploadImgCard/uploadImgCard.js
import HiNavigator from "../../navigator/hi-navigator";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
      foodTask:{
          type:Object,
          value:{}
      },
      foodExt:{
          type:Object,
          value:{}
      },
      foodAheight:{
          type:Number,
          value:0
      },

      foodHiddenImg:{
          type:Boolean,
          value:false
      },
      calorie:{
          type:Number,
          value:0
      },
      carbohydrate:{
          type:Number,
          value:0
      },
      fat:{
          type:Number,
          value:0
      },
      protein:{
          type:Number,
          value:0
      },
      foodcurrentSwiper:{
          type:Number,
          value:0
      },
  },

  /**
   * 组件的初始数据
   */
  data: {
      proportionList:['卡路里','碳水化合物','脂肪','蛋白质'],
      proportionNum:['300','12','20','35'],
      hiddenImg: false,//隐藏左右箭头
      grayLeft: true,//灰色箭头左
      grayRight: false,//灰色箭头右
      foodcurrentSwiper: 0,
      calorie:0,//卡路里
      carbohydrate:0,//碳水化合物
      fat:0,//脂肪
      protein:0 //蛋白质
  },

  /**
   * 组件的方法列表
   */
  methods: {
      bindTapSportType(e){
          HiNavigator.navigateToImgClock({id: e.currentTarget.dataset.finid});
      },
      toRules(){
          HiNavigator.navigateToFoodRuler();
      },
      sum(arr,Num) {
          var result= 0;
          var len=arr.length;
          if(Num === 1){
              for (var i=0;i<len;i++) {
                  result += arr[i].calorie;
              }
              return result;
          }
          if(Num === 2){
              for (var i=0;i<len;i++) {
                  result += arr[i].carbohydrate;
              }
              return result;
          }
          if(Num === 3){
              for (var i=0;i<len;i++) {
                  result += arr[i].fat;
              }
              return result;
          }
          if(Num === 4){
              for (var i=0;i<len;i++) {
                  result += arr[i].protein;
              }
              return result;
          }
      },
      //轮播图当前
      swiperChange: function (e) {
          let currentList = this.data.foodExt.mealList[e.detail.current].list;
          this.setData({
              foodcurrentSwiper: e.detail.current,
              foodAheight: currentList.length * 200,
              calorie:this.sum(currentList,1),
              carbohydrate:this.sum(currentList,2),
              fat:this.sum(currentList,3),
              protein:this.sum(currentList,4)
          })
          if (e.detail.current === 0) {
              this.setData({
                  grayLeft: true,
                  grayRight: false
              })
              return
          }
          if (e.detail.current === this.data.foodExt.mealList.length - 1) {
              this.setData({
                  grayLeft: false,
                  grayRight: true
              })
              return
          }
          this.setData({
              grayLeft: false,
              grayRight: false,
          })


      },
      //饮食打卡--左按钮
      imgToPre() {
          this.setData({
              foodcurrentSwiper: this.data.foodcurrentSwiper - 1
          })
      },
      //饮食打卡--右按钮
      imgToNext() {
          this.setData({
              foodcurrentSwiper: this.data.foodcurrentSwiper + 1
          })
      },
      //饮食打卡详情
      toDynamicDetails(e){
          HiNavigator.navigateToMessageDetail({messageId: e.currentTarget.dataset.finid});
      }
  }
})
