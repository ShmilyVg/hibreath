// pages/set-info/set-info.js
import toast from "../../view/toast";
import * as tools from "../../utils/tools";

Page({

    data: {
        sexBox: [{image: 'man', text: '男士', isChose: false}, {image: 'woman', text: '女士', isChose: false}],
        info: {birthday: '1980-01-01'},
        currentDate: '2018-12-19',
        page: 1,
        title: ['你的性别是？', '你的出生日期？', '你的身高？', '你的体脂情况？'],
        text: ['告诉我们关于你的事，\n让我帮你获得更适合的健康方案', '我们会针对不同的年龄为你定制相应的健康方案', '', '根据图片估算一下你的体脂含量吧'],
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
    },

    continue() {
        switch (this.data.page) {
            case 1:
                if (typeof (this.data.info.sex) == "undefined") {
                    toast.warn('请填写信息');
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
                if (typeof (this.data.info.height) == "undefined" || typeof (this.data.info.weight) == "undefined") {
                    toast.warn('请填写信息');
                } else {
                    this.setData({
                        page: ++this.data.page,
                    })
                }
                break;
            case 4:
                break;
        }
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
    },

    bindWeightInput(e) {
        this.setData({
            'info.weight': e.detail.value
        })
    },

    page4ItemClick(e){
        let index = e.currentTarget.dataset.index;
        this.setData( {
           choseIndex: index
        } );
    }

})