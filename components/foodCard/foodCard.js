// components/uploadImgCard/uploadImgCard.js
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";

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
    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached: function () {
            setTimeout(()=>{
                if(this.data.foodcurrentSwiper == 0){
                    this.setData({
                        grayLeft: true,
                        grayRight: false
                    })
                }else if(this.data.foodcurrentSwiper == this.data.foodExt.mealList.length - 1){
                    this.setData({
                        grayLeft: false,
                        grayRight: true
                    })
                }else{
                    this.setData({
                        grayLeft: false,
                        grayRight: false
                    })
                }
            })
            this.animation = wx.createAnimation({
                duration: 1000,
                timingFunction: 'ease'
            })
        },
        moved: function () { },
        detached: function () { },
    },
    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function () {
            console.log('foodcurrentSwiper',this.data.foodcurrentSwiper)
        },
        hide: function () { },
        resize: function () { },
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
      protein:0, //蛋白质
      num:1
  },

  /**
   * 组件的方法列表
   */
  methods: {
      async foodChange(e){
          console.log('groupId',)
          this.animation.rotate(360*this.data.num).step();
          this.setData({
              num:this.data.num+1,
              rotate3dA: this.animation.export()
          })
          const{result}=await Protocol.postFoodChange({groupId:e.currentTarget.dataset.groupid})
          let index = this.data.foodcurrentSwiper
          this.setData({
              [`foodExt.mealList[${index}].list`]:result.data.dataList,

          })
          if(result.data.dataList.length == 1){
              this.setData({
                  foodAheight: 230
              })
          }else{
              this.setData({
                  foodAheight: result.data.dataList.length * 110+235
              })
          }

      },
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
          if(currentList.length==1){
              this.setData({
                  foodAheight: 230
              })
          }else{
              this.setData({
                  foodAheight: currentList.length * 110+235
              })
          }
          this.setData({
              foodcurrentSwiper: e.detail.current,
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
      toDetails(){
        HiNavigator.navigateTorecommendation()
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
          console.log('eee',e)
          HiNavigator.navigateToMessageDetail({messageId: e.currentTarget.dataset.dataid});
      },
      toDynamicDetailsAll(e){
        if(this.data.foodTask.finished){
            HiNavigator.navigateToMessageDetail({messageId: e.currentTarget.dataset.dataid});
            return
        }
          HiNavigator.navigateToImgClock({id: e.currentTarget.dataset.finid});
      }
  }
})
