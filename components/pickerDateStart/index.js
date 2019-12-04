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
      let date = new Date();
      this.data.secYear = date.getYear();;
      this.data.secMopnth = date.getMonth()+1;
      this.data.secDay = date.getDate();
      console.log(1111,this.data.secYear, date.getMonth(), date.getDate())
      console.log(this.data.secYear)

      this.data.value.push(this.data.secYear +11);
      this.data.value.push(this.data.secMopnth - 2)
      this.data.value.push(this.data.secDay +1)
      console.log('d3e1233213', this.data.value)
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
    year: '',
    months: months,
    month: '',
    days: days,
    day: '',
    value: [],
    secYear:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindChange: function (e) {
      console.log(e, 'eeee')
      const val = e.detail.value
      this.setData({
        year: this.data.years[val[0]],
        month: this.data.months[val[1]],
        day: this.data.days[val[2]]
      })
      console.log('this.data.year+\'-\'+this.data.month+\'-\'+this.data.day', this.data.year + '-' + this.data.month + '-' + this.data.day)
      this.triggerEvent("childSecDate", this.data.year + '-' + this.data.month + '-' + this.data.day);
    },
    setTime:function(){
     
    }
  }
})
