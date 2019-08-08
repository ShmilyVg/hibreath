// pages/set-info/set-info.js
import toast from "../../view/toast";
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
import WXDialog from "../../view/dialog";


Page({

    data: {
        isFirst:true,//身体评估引导页标志位
        isexact:true,//是否准确测过体脂率
        sexBox: [{image: 'man', text: '男士', isChose: false}, {image: 'woman', text: '女士', isChose: false}],
        currentDate: '2018-12-19',
        page: 1,
        title: ['你的性别是？', '你的出生日期？', '身高(cm)？', '体脂率(%)'],
        text: ['告诉我们关于你的事，\n让我帮你获得更适合的健康方案', '我们会针对不同的年龄为你定制相应的健康方案', '', ''],
        page4MenItem: ['3-4%', '6-7%', '10-12%', '15%', '20%', '25%', '30%', '35%', '40%'],
        page4WomenItem: ['10-12%', '15-17%', '20-22%', '25%', '30%', '35%', '40%', '45%', '50%'],
        itemBackgroundColor: '#656565',
    },
    onLoad: function (options) {
        let timeS = tools.createDateAndTime(Date.parse(new Date()));
        let currentDate = `${timeS.year}-${timeS.month}-${timeS.day}`;
        this.setData({
            currentDate: currentDate
        })
        Protocol.postPhysical().then(data => {
            console.log("99",data)
            let dataInfo = data.result
            if(dataInfo.info.birthday !== ""){
                this.setData({
                    birthday: dataInfo.info.birthday
                })
            }else{
                this.setData({
                    birthday: '1980-01-01',
                })
            }
            if(dataInfo.info.height !== ""){
                this.setData({
                    height: dataInfo.info.height
                })
            }else{
                this.setData({
                    height: '175',
                })
            }
            if(dataInfo.info.weight !== ""){
                this.setData({
                    weight: dataInfo.info.weight
                })
            }else{
                this.setData({
                    weight: '70',
                })
            }
            if(dataInfo.info.bodyFatRate !== ""){
                this.setData({
                    bodyFatRate: dataInfo.info.bodyFatRate
                })
            }else{
                this.setData({
                    bodyFatRate: '20%',
                })
            }
           //获取上次填写性别 出生日期等记录
        })
        let info={
            birthday: '1980-01-01',
            sex:'',
            height:'11',
            weight:'',
            bodyFatRate:'25%',
            choseIndex:3,
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
        switch (this.data.page) {
            case 1:
                console.log(this.data.info.sex == "","性别")
                if (typeof (this.data.info.sex) == "undefined" || this.data.info.sex === "") {
                    toast.warn('请选择性别');
                } else {
                    this.setData({
                        page: ++this.data.page,
                    })
                }
                break;
            case 2:
                this.setData({
                    page: ++this.data.page,
                });
                break;
            case 3:
                if (typeof (this.data.info.height) == "undefined" || typeof (this.data.info.weight) == "undefined"  || this.data.info.height === ""  || this.data.info.weight === "") {
                   if(typeof (this.data.info.height) == "undefined"   || this.data.info.height === "" ){
                       toast.warn('请填写身高');
                   }else if(typeof (this.data.info.weight) == "undefined" || this.data.info.weight === ""){
                       toast.warn('请填写体重');
                   }
                } else {
                    this.setData({
                        page: ++this.data.page,
                    })
                }
                break;
            case 4:
                if (typeof (this.data.choseIndex) == "undefined" && this.data.isexact == true) {
                    toast.warn('请选择图片');
                } else if(typeof (this.data.choseIndex) !== "undefined" && this.data.isexact == true) {
                    let list = this.data.page4MenItem;
                    if (this.data.info.sex === 0) {
                        list = this.data.page4WomenItem;
                    }
                    this.setData({
                        'info.bodyFatRate': list[this.data.choseIndex]
                    });
                    Protocol.postBreathPlanAnalysis(this.data.info).then(data => {
                        this.setisFirst();
                    })
                }else if(typeof (this.data.info.bodyFatRate) == "undefined" && this.data.isexact == false  || this.data.info.bodyFatRate === ""){
                    toast.warn('请填写体脂率');
                }else if(this.data.isexact == false && this.data.info.bodyFatRate>=100){
                    WXDialog.showDialog({
                        title: '小贴士', content:"请输入正确的体脂率，体脂率范围1%-100%", confirmText: '我知道了', confirmEvent: () => {
                        }
                    });

                }else if(this.data.isexact == false){
                    if(this.data.info.bodyFatRate.toString().split(".")[1].length>1){
                        WXDialog.showDialog({
                            title: '小贴士', content:"请精确到小数点后一位", confirmText: '我知道了', confirmEvent: () => {
                            }
                        });
                }}else{
                    Protocol.postBreathPlanAnalysis(this.data.info).then(data => {
                        this.setisFirst();
                    })
                }
                break;
        }
    },

    chooseSex(e) {
        console.log(e,'eee')
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
    setisFirst(){
        this.setData({
            'isFirst': false
        })
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
        console.log(typeof(e.detail.value),"89888")
    },

    bindWeightInput(e) {
        this.setData({
            'info.weight': e.detail.value
        })
    },
    //填写体脂率
    bindExactInput(e){
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

    page4ItemClick(e){
        let index = e.currentTarget.dataset.index;
        this.setData({
           choseIndex: index
        });
    },

    IntoExact(){
        this.setData({
            isexact: false
        });
    },

    IntoNoExact(){
        this.setData({
            isexact: true
        });
    }

})
