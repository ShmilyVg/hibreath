// pages/set-info/set-info.js
import toast from "../../view/toast";
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
import WXDialog from "../../view/dialog";


Page({

    data: {
        isexact: false,//是否准确测过体脂率
        sexBox: [
            {image: 'man', text: '男士', isChose: false},
            {image: 'woman', text: '女士', isChose: false}
        ],
        currentDate: '2018-12-19',
        page: 1,
        choseIndex: "3",
        title: ['减值目标', '体重目标', '性别', '出生日期', '身高', '体脂率', '您的三餐选择', '选择一套方案'],
        page4MenItem: ['3-4%', '6-7%', '10-12%', '15%', '20%', '25%', '30%', '35%', '40%'],
        page4WomenItem: ['10-12%', '15-17%', '20-22%', '25%', '30%', '35%', '40%', '45%', '50%'],
        itemBackgroundColor: '#656565',
        meals: [
            {text: '外卖为主', isChose: false},
            {text: '外出就餐为主', isChose: false},
            {text: '单位食堂为主', isChose: false}
        ]
    },
    onLoad: function (options) {
        //截止日期范围
        const {year, month, day} = tools.createDateAndTime(Date.parse(new Date()));
        let currentDate = `${year}-${month}-${day}`;
        this.setData({currentDate});
        // Protocol.postPhysical().then(data => {
        //     let dataInfo = data.result
        //     if (dataInfo.info.birthday !== "") {
        //         this.setData({
        //             birthday: dataInfo.info.birthday
        //         })
        //     } else {
        //         this.setData({
        //             birthday: '1980-01-01',
        //         })
        //     }
        //     if (dataInfo.info.height !== "") {
        //         this.setData({
        //             height: dataInfo.info.height
        //         })
        //     } else {
        //         this.setData({
        //             height: '175',
        //         })
        //     }
        //     if (dataInfo.info.weight !== "") {
        //         this.setData({
        //             weight: dataInfo.info.weight
        //         })
        //     } else {
        //         this.setData({
        //             weight: '70',
        //         })
        //     }
        //     if (dataInfo.info.bodyFatRate !== "") {
        //         this.setData({
        //             bodyFatRate: dataInfo.info.bodyFatRate
        //         })
        //     } else {
        //         this.setData({
        //             bodyFatRate: '25%',
        //         })
        //     }
        //     //获取上次填写性别 出生日期等记录
        // })
        let info = {
            birthday: '1980-01-01',
            sex: 1,
            height: '11',
            weight: '',
            bodyFatRate: '12.4',
        };
        /* for(var i=0;i<this.data.sexBox.length;i++){
             if(this.data.info.sex ==this.data.sexBox[i]. image){

             }
         }*/

        this.setData({
            info: info
        })
    },

    continue() {
        const info = this.data.info;
        switch (this.data.page) {
            case 1:
                break;
            case 2:
                break;
            case 3:
                if (this.objIsEmpty(info.sex)) {
                    toast.warn('请选择性别');
                    return;
                }
                break;
            case 4:
                break;
            case 5:
                if (this.objIsEmpty(info.height)) {
                    toast.warn('请填写身高');
                    return;
                }
                break;
            case 6:
                if (this.data.isexact) {
                    if (this.objIsEmpty(this.data.choseIndex)) {
                        toast.warn('请选择图片');
                        return;
                    } else {
                        let list = this.data.page4MenItem;
                        if (this.data.info.sex === 0) {
                            list = this.data.page4WomenItem;
                        }
                        this.setData({
                            'info.bodyFatRate': list[this.data.choseIndex]
                        });
                        return;
                    }
                } else {
                    if (this.objIsEmpty(info.bodyFatRate)) {
                        toast.warn('请填写体脂率');
                        return;
                    } else if (parseInt(this.data.info.bodyFatRate) >= 100) {
                        this.showDialog("请输入正确的体脂率，体脂率范围1%-100%");
                        return;
                    } else {
                        const num = this.data.info.bodyFatRate.toString().split(".");
                        if (!num[1] || num[1] >= 10) {
                            this.showDialog("请精确到小数点后一位");
                            return;
                        }
                    }

                }
                break;
            case 7:
                break;
            case 8:
                Protocol.postBreathPlanAnalysis(info).then(data => {
                    this.setisFirst();
                });
                return;
        }
        this.setData({
            page: ++this.data.page,
        });
    },

    objIsEmpty(obj) {
        return (typeof (obj) === "undefined" || obj === "");
    },

    showDialog(content) {
        WXDialog.showDialog({title: '小贴士', content, confirmText: '我知道了'});
    },

    back() {
        this.setData({
            page: --this.data.page
        })
    },

    chooseSex(e) {
        let choseIndex = e.currentTarget.dataset.index;
        this.data.sexBox.map((value, index) => {
            value.isChose = choseIndex == index;
        });
        let postSex = 0;
        let sexStr = 'woman';
        if (choseIndex == 0) {
            postSex = 1;
            sexStr = 'man'
        }
        this.setData({
            sexBox: this.data.sexBox,
            'info.sex': postSex,
            'info.sexStr': sexStr
        })
    },

    clickMeals(e) {
        let choseIndex = e.currentTarget.dataset.index;
        console.log(choseIndex);
        this.data.meals.map((value, index) => {
            value.isChose = choseIndex == index
        });
        this.setData({meals: this.data.meals})
    },

    setisFirst() {
        this.setData({
            'isFirst': false
        })
    },

    bindTarget(e) {
        console.log(e.detail.value);
    },

    bindBirthChange(e) {
        let value = e.detail.value;
        this.setData({
            'info.birthday': value
        })
    },

    bindHeightInput(e) {
        this.setData({
            'info.height': e.detail.value
        })
        console.log(typeof(e.detail.value), "89888")
    },

    bindWeightInput(e) {
        this.setData({
            'info.weight': e.detail.value
        })
        console.log("test,", this.info.weight)
    },

    /* bindWeightInput(e) {
         let that =this;
         let dataset =e.currentTarget.dataset;
         console.log(dataset,"dataset")
         let value = e.detail.value;
         let nameTest =dataset.nameT;
         that.data[nameTest]=value;
         this.setData({
             'info.weight':  that.data[nameTest]
         })
         console.log("test,",that.data[nameTest])
     },*/


    //填写体脂率
    bindExactInput(e) {
        var BMINumber;
        BMINumber = e.detail.value;
        console.log(BMINumber);
        this.setData({
            'info.bodyFatRate': BMINumber
        })
        /* if (BMINumber.toString().split(".")[1].length<=1 && Number(BMINumber)<100) { //正则验证，小数点后不能大于1位数字
             this.setData({
                 'info.bodyFatRate': BMINumber+"%"
             })
         } else {
             WXDialog.showDialog({
                 title: '小贴士', content:"请输入正确的体脂率，体脂率范围1%-100%", confirmText: '我知道了', confirmEvent: () => {

                 }
             });
         };
 */
    },

    page4ItemClick(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            choseIndex: index
        });
    },

    IntoExact() {
        this.setData({
            isexact: false
        });
    },

    IntoNoExact() {
        this.setData({
            isexact: true
        });
    }

})
