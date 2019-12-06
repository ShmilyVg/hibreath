// components/exciting-window/exciting-window.js
import Protocol from "../../modules/network/protocol";
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
            if(this.data.toastType === 'fatBurn'){
                this.setData({
                    excitingTitleL:"燃脂情况",
                    todayFirst:this.data.toastResult.taskInfo.fatBurn.todayFirst,
                    excitingTitleR:"·"+this.data.toastResult.taskInfo.fatBurn.desZh,
                    excitingContent:"",
                    excitingNumber:Math.abs(this.data.toastResult.taskInfo.fatBurn.thanValue),
                })

                if(this.data.toastResult.taskInfo.fatBurn.thanValue>0){
                    this.setData({
                        excitingContent:"恭喜！比上次结果多出",
                        excitingReduce:false,
                        excitingNumber:this.data.toastResult.taskInfo.fatBurn.thanValue
                    })
                }else if(this.data.toastResult.taskInfo.fatBurn.thanValue<0){
                    this.setData({
                        excitingContent:"比上次结果少了",
                        excitingReduce:true,
                        excitingNumber:Math.abs(this.data.toastResult.taskInfo.fatBurn.thanValue)
                    })
                }else{
                    this.setData({
                        excitingContent:"和上次结果一致",
                        excitingReduce:false,
                        excitingNumber:""
                    })
                }


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

  },

  /**
   * 组件的方法列表
   */
  methods: {
      excitingKnow(){
          this.triggerEvent("getShowExcitation", {showExcitation:false} )
      }
  }
})
