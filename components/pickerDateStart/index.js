// components/pickerDate/index.js.js
let date = new Date();
let years = [];
let months = [];
let days = [];
let days1 = [];
let secYear = date.getFullYear();
let secYearMax = date.getFullYear();
let secMopnth = date.getMonth() + 1;
console.log(secMopnth);
let secDay = date.getDate();
let secDay1 = 1;
let secMopnthMax = secMopnth;
let secDayMax = secDay+14;
let secDayMax1 = 31;


if (secDay + 14 > 31) {
    secMopnthMax = secMopnth + 1;
    secDayMax1 = secDay + 14 - 31;
    secDay1 = 1;
    secDayMax = 31;
}
if (secMopnthMax >= 13) {
    //secMopnth = 1;
    secYearMax = secYear + 1;
    secMopnthMax = 12;
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
for (let i = secDay1; i <= secDayMax1; i++) {
  days1.push(i)
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
    secYear:'',
    canSubc:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
      getDateStart(){
      const { year, month, day } = this.data;
      return year + '-' + month + '-' + day;
    },
      getCanSub(){
          return this.data.canSubc
      },
      bindpickend(){
          let canSub = true;
          return canSub
      },
    bindChange: function (e) {
      console.log(e, 'eeee');
      const val = e.detail.value;
      console.log(val);
      if(years.length===2){
        console.log(this.data.value);
        if (val[0] !== 0) {
          months = [1];
          this.setData({
            months:[1],
            days: days1,
          })
        }else{
          this.setData({
            days: days,
            months:[12]
          })
        }

      }
      if(months.length===2){
        if (val[1] !== 0){
          this.setData({
            days: days1
          })
        }else{
          this.setData({
            days: days
          })
        }
      }


      this.setData({
        value:[val[0],val[1],val[2]],
        year: this.data.years[val[0]],
        month: this.data.months[val[1]],
        day: this.data.days[val[2]],
        canSubc:true
      })
      console.log('99999', this.data.year + '-' + this.data.month + '-' + this.data.day)
     /* this.triggerEvent("canSubc", { canSubC: true });*/
    },

  }
})
