// components/pickerDate/index.js.js
const date = new Date();
const years = [];
const months = [];
const days = [];
const secYear = date.getFullYear();
const secYearMax = date.getFullYear();
const secMopnth = date.getMonth() + 1;
const secDay = date.getDate();
const secMopnthMax = secMopnth;
const secDayMax = secDay+14;

if (secDay + 14 > 31) {
    secMopnthMax = secMopnth + 1;
    secDayMax = secDay + 14 - 31;
    secDay = 1
}
if (secMopnthMax > 12) {
  secMopnth = 1;
  secYearMax = secYear + 1;
}
for (let i = secYear; i <= secYearMax; i++) {
  years.push(i)
}

for (let i = secMopnth; i <= secMopnthMax; i++) {
  months.push(i)
}

for (let i = secDay; i <= secDayMax; i++) {
  days.push(i)
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    yearsValue: {
      type: Number,
      value: 0
    },
    monthsValue: {
      type: Number,
      value: 0
    },
    daysValue: {
      type: Number,
      value: 0
    },
    info: {
      type: Object,
      value: {}
    }
  },
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached: function () {
      console.log(years,months,days);
      this.data.value.push(0);
      this.data.value.push(0);
      this.data.value.push(1);


      console.log('d3e1233213', this.data.value);

      this.setData({
        value: this.data.value
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示

    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    years: years,
    year: years,
    months: months,
    month: months,
    days: days,
    day: days[1],
    value: [],
    secYear:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
      getDateStart(){
      const { year, month, day } = this.data;
      return year + '-' + month + '-' + day;
    },
    bindChange: function (e) {
      console.log(e, 'eeee')
      const val = e.detail.value
      this.setData({
        value:[val[0],val[1],val[2]],
        year: this.data.years[val[0]],
        month: this.data.months[val[1]],
        day: this.data.days[val[2]],
      })
      console.log('99999', this.data.year + '-' + this.data.month + '-' + this.data.day)
      this.triggerEvent("childSecDate", { date: this.data.year + '-' + this.data.month + '-' + this.data.day});
    },
      bindpickend(){
       let canSub = true;
          return canSub
      },
    setTime:function(){

    }
  }
})
