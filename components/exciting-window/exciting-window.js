// components/exciting-window/exciting-window.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
/**
 * @Date: 2019-12-04 10:13:05
 * @LastEditors: 张浩玉
 */
/**
 * toastType
 * fatBurn：燃脂检测完成  weight：体重信息更新   food:饮食打卡  sport：运动打卡
 *
 *
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      toastType: {
          type: String,
          value: ''
      },
      toastResult: {
          type: Object,
          value: {}
      },
  },
    lifetimes: {
        async created() {
         /* console.log('toastType',this.data.toastType)
          const {result} = await Protocol.postIncentive();
*/
        },
        attached() {
            if(this.data.toastResult.finishNum !== this.data.toastResult.taskNum){
              if(this.data.toastType == "fatBurn"){
                this.setData({
                  btnText:"去量体重"
                })
              }
              if(this.data.toastType == "weight"){
                this.setData({
                  btnText:"去测燃脂速度"
                })
              }
            }
            if(this.data.toastType === 'fatBurn'){
                this.setData({
                    excitingTitleL:"燃脂情况",
                    excitingTitleR:"·"+this.data.toastResult.taskInfo.fatBurn.desZh,
                    excitingContent:"当前燃脂速度",
                    excitingNumber:this.data.toastResult.taskInfo.fatBurn.thisValue,
                    showDif:true,
                })
            }
            if(this.data.toastType === 'weight'){
                this.setData({
                    excitingTitleL:"身体评估",
                    todayFirst:this.data.toastResult.taskInfo.bodyIndex.todayFirst,
                    excitingTitleR:"·"+"体重"+this.data.toastResult.taskInfo.bodyIndex.weight+"kg",
                })
                if(this.data.toastResult.taskInfo.bodyIndex.thanValue>0){
                    this.setData({
                        excitingContent:"比上次称重多了",
                        excitingReduce:true,
                        excitingNumber:this.data.toastResult.taskInfo.bodyIndex.thanValue+"kg"
                    })
                }else if(this.data.toastResult.taskInfo.bodyIndex.thanValue<0){
                    this.setData({
                        excitingContent:"恭喜！比上次称重又瘦了",
                        excitingReduce:false,
                        excitingNumber:Math.abs(this.data.toastResult.taskInfo.bodyIndex.thanValue)+"kg"
                    })
                }else{
                    this.setData({
                        excitingContent:"和上次称重一致",
                        excitingReduce:false,
                        excitingNumber:""
                    })
                }
            }
            if(this.data.toastType === 'food'){
                this.setData({
                    excitingTitleL:"饮食打卡",
                    excitingTitleR:"",
                })
            }
        },
        detached() {

        },
    },
  /**
   * 组件的初始数据
   */
  data: {
      showModalStatus:false,
      btnText:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goRecomTar(){
      HiNavigator.navigateToLowFatReport()
    },
    goTask(){
      HiNavigator.switchToSetInfo()
      this.excitingKnow()
    },
      excitingKnow(){
          if(this.data.toastType == "fatBurn"){
            this.triggerEvent("getShowExcitation", {showExcitation:false,showWeight:true} )
          }else{
            this.triggerEvent("getShowExcitation", {showExcitation:false} )
          }

      },
      /*阻止滚动*/
      stopScroll(){
          console.log('阻止滚动')
          return;
      },
      //立即分享
      excitingShare(){
          if(this.data.toastType == 'fatBurn'){
            let type = "fatBurn"
            HiNavigator.navigateToShareDynamics({type:type,orderNumber:0})
          }else if(this.data.toastType == 'weight'){
            let type = "bodyIndex"
            HiNavigator.navigateToShareDynamics({type:type,orderNumber:0})
          }

      /*  this.setData({
            showModalStatus:true
        })
       this.showModal()*/

      },
      showModal: function() {
          // 显示遮罩层
          var animation = wx.createAnimation({
              duration: 200,
              timingFunction: "ease-in-out",
              delay: 0
          });
          this.animation = animation;
          animation.translateY(500).step();
          this.setData({
              animationData: animation.export(),
              showModalStatus: true
          });
          setTimeout(
              function() {
                  animation.translateY(0).step();
                  this.setData({
                      animationData: animation.export()
                  });
              }.bind(this),
              200
          );
      },
      hideModal: function() {
          this.setData({
              showModalStatus: false
          });
      },
  }
})
