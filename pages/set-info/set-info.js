// pages/set-info/set-info.js
import toast from "../../view/toast";
import * as tools from "../../utils/tools";

Page({

    data: {
        sexBox: [{image: 'man', text: '男士', isChose: false}, {image: 'woman', text: '女士', isChose: false}],
        info: {birthday: '1980-01-01'},
        currentDate: '2018-12-19',
        page: 3,
        title: ['你的性别是？', '你的出生日期？', '你的身高？', '你的体脂情况？'],
        text: ['告诉我们关于你的事，\n让我帮你获得更适合的健康方案', '我们会针对不同的年龄为你定制相应的健康方案', '', '根据图片估算一下你的体脂含量吧']
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
        if (choseIndex == 0) {
            postSex = 1
        }
        this.setData({
            sexBox: this.data.sexBox,
            info: {sex: postSex}
        })
    },

    bindBirthChange(e) {
        let value = e.detail.value;
        this.setData({
            'info.birthday': value
        })
    },

    bindHeightInput(e){
        this.setData({
            'info.height': e.detail.value
        })
    },

    bindWeightInput(e){
        this.setData({
            'info.weight': e.detail.value
        })
    }

})