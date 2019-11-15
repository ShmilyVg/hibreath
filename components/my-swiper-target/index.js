const DIVIDE_NUM = 70, contentList = [
  { id: 1, goalDesc: '认真吃早餐才能每天充满活力', headUrl: 'https://backend.hipee.cn/hipee-resource/public/5af8e81ee8fa4550a79f97193ce4a69b.jpg' },
  { id: 2, goalDesc: '用一个月瘦成闪电', headUrl: 'https://backend.hipee.cn/hipee-resource/public/cdb0e33a87b64014996bc03dab69666d.jpg' },
  { id: 3, goalDesc: '每周跑步30分钟', headUrl: 'https://backend.hipee.cn/hipee-resource/public/5293bd4ae12d4dc6bc9af3f3fbad9a8d.jpg' },
  { id: 4, goalDesc: '用一个月瘦成闪电', headUrl: 'https://backend.hipee.cn/hipee-resource/public/1d654fcd450f4e5bb8faed8dd63d3525.jpg' },
  { id: 5, goalDesc: '早睡觉注意身体', headUrl: 'https://backend.hipee.cn/hipee-resource/public/9c792d71731b4e31b086c93c1e9f7e87.jpg' },

], scaleList = [

  { scaleValue: 0.4, opacity: 0.4, index: 1 },

  { scaleValue: 0.7, opacity: 0.7,  index: 2 },
  { scaleValue: 1, opacity: 1, index: 5 },
  { scaleValue: 0.7, opacity: 0.7, index: 2 },

  { scaleValue: 0.4, opacity: 0.4,index: 1 },

], translateList = scaleList.map((item, index) => {
  return { ...item, translateYValue: DIVIDE_NUM * index };
});
const MAX_Y = parseInt(translateList[translateList.length - 1].translateYValue);

function getNextUpdateList({ list }) {
  const { length } = list, middleIndex = Math.floor(length / 2);
  return list.map((item) => {
    let y = item.translateYValue + DIVIDE_NUM;
    if (y > MAX_Y) {
      y = 0;
    }
    return { ...item, translateYValue: y };
  }).sort(function (item1, item2) {
    return item1.translateYValue - item2.translateYValue;
  }).map((item, index) => {
    return {
      ...item,
      ...scaleList[index],
      color: middleIndex === index ? '#ED6F69' : '#7D7D7D',
      // opacity: middleIndex === index ? '1' :'0.6' 
    };
  })
}


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
    list: getNextUpdateList({
      list: contentList.map((item, index) => {
        return { ...item, ...translateList[index] };
      })
    })
  },
  pageLifetimes: {
    show() {

    },
    hide() {

    }
  },
  lifetimes: {
    created() {
      this.intervalIndex = 0;

    },
    attached() {
      
      this.intervalIndex = setInterval(() => {
        const nextList = getNextUpdateList({ list: this.data.list });
        console.log(nextList);
        this.setData({
          list: nextList
        });
      }, 2000);


    },
    detached() {
      clearInterval(this.intervalIndex);
    }

  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
});
