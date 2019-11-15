
import Protocol from "../../modules/network/protocol";


const DIVIDE_NUM = 70, scaleList = [

    {scaleValue: 0.4, opacity: 0.4,index:1},
    
  { scaleValue: 0.7, opacity: 0.7,index: 2},
  { scaleValue: 1, opacity: 1, index: 5},
  { scaleValue: 0.7, opacity: 0.7 ,index: 2},
    
  { scaleValue: 0.4, opacity: 0.4, index: 1},
   
], translateList = scaleList.map((item, index) => {
    return {...item, translateYValue: DIVIDE_NUM * index};
});
const MAX_Y = parseInt(translateList[translateList.length - 1].translateYValue);

Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
      list:[],
      goalsList:[]

    },
    pageLifetimes: {
        show() {
         
        },
        hide() {
         
        }
    },
    lifetimes: {
        created() {
          
          this.onPostSettingsGoals();
        },
       
        attached() {
          setTimeout(() => {
            const goalsList = this.data.list.map((item, index) => {
              return { ...item, ...translateList[index] };
            })
            this.setData({
              goalsList: goalsList
            })
            //console.log(this.data.goalsList, 'this.data.goalsList')



            
          }, 100) 
        
           
            setInterval(() => {
              
              const { goalsList, goalsList: { length } } = this.data, middleIndex = Math.floor(length / 2);
              console.log('开始执行')
              console.log(goalsList, 'goalsList')
              this.setData({ 
                        
                goalsList: goalsList.map((item) => {
                  let y = item.translateYValue + DIVIDE_NUM;
                  //console.log(y)
                  if (y > MAX_Y) {
                    y = 0;
                  }
                  return { ...item, translateYValue: y };
                }).sort(function (item1, item2) {
                  return item1.translateYValue - item2.translateYValue;
                  console.log()
                }).map((item, index) => {
                  return {
                    ...item,
                    ...scaleList[index],
                    color: middleIndex === index ? '#ED6F69' : '#7D7D7D',
                    
                  };
                }),
                
                  
               
              });
            }, 2000);
               
 
               


        }
     

    },
    /**
     * 组件的方法列表
     */
    methods: {
      async onPostSettingsGoals() {
        const {result} = await Protocol.postSettingsGoals();
          this.setData({
            list :result.list
          })
       console.log('111',this.data.list)
      },
    }
});
