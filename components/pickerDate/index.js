// components/pickerDate/index.js.js
const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1890; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
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
      /*if(this.data.info.birthday)*/
      console.log('riqi', this.data.info.birthday)
      var secYear = Number(this.data.info.birthday.split("-")[0]);
      console.log('secYear', secYear)
      console.log('date.getFullYear()', date.getFullYear())
      var secMopnth = Number(this.data.info.birthday.split("-")[1]);
      var secDay = Number(this.data.info.birthday.split("-")[2])
      console.log('数字', secYear - 1890, secMopnth - 1, secDay - 1)
      this.setData({
        value: []
      })
      this.data.value.push(secYear - 1890);
      this.data.value.push(secMopnth - 1)
      this.data.value.push(secDay - 1)
      console.log('d3e1233213', this.data.value)
      this.setData({
        value: this.data.value,
      })
      this.triggerEvent("childSecDate", secYear + '-' + secMopnth + '-' + secDay);
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
    year: 1980,
    months: months,
    month: 1,
    days: days,
    day: 1,
    value: [90, 0, 0],
    scrollTip: true,
    serial_y:90,
    serial_m: 0,
    serial_d:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getDateStart() {
      const { year, month, day } = this.data;

      return year + '-' + month + '-' + day;
    },
    bindpickstart() {
      this.setData({
        scrollTip: false
      })
    },
    bindpickend() {
      this.setData({
        scrollTip: true
      })
    },
    bindChange: function (e) {
      // console.log(e,'eeee')
      const val = e.detail.value
      this.setData({
        serial_y: val[0],
        serial_m: val[1],
        serial_d: val[2],
        year: this.data.years[val[0]],
        month: this.data.months[val[1]],
        day: this.data.days[val[2]]
      })
      this.triggerEvent("childSecDate", this.data.year + '-' + this.data.month + '-' + this.data.day);
    }
  }

})
