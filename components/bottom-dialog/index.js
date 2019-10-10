import * as tools from "../../utils/tools";

Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        list: {
            type: Array,
            value: []
        },
        inputType: {
            type: String,
            value: 'number'
        },
        maxLength: {
            type: Number,
            value: 3
        },
    },

    data: {
        showModalStatus: false,
    },
    lifetimes: {
        created() {
        },
        attached() {

        },
    },
    methods: {

        showModal() {
            // 显示遮罩层
            this.triggerEvent('onShowEvent', {show: true});
            const animation = wx.createAnimation({
                duration: 200,
                timingFunction: "ease-in-out",
                delay: 0
            });
            animation.translateY(500).step();
            this.setData({
                animationData: animation.export(),
                showModalStatus: true
            });
            setTimeout(function () {
                animation.translateY(0).step()
                this.setData({
                    animationData: animation.export()
                })
            }.bind(this), 100);

        },

        _bindInputEvent(e){
            if (this.data.inputType !== 'digit') {
                return e.detail.value;
            }
            const weightNumber = e.detail.value.split(".");
            console.log('eeeee',weightNumber[1])
            if(weightNumber[1]>9 ||weightNumber[1] === "0"){
                //return Number(e.detail.value).toFixed(1);
                return tools.subStringNum(e.detail.value)
            }
            if(weightNumber.length>2){
                return parseInt(e.detail.value);
            }
        },
        hideModal() {
            this.setData({
                showModalStatus: false,
            }, () => {
                this.triggerEvent('onShowEvent', {show: false});
            });
        },
        formSubmit(e) {
            console.log(e.detail.value);
            this.hideModal();
            const {maxLength, inputType} = this.data;
            this.triggerEvent('onSubmitEvent', {value: {...e.detail.value}, maxLength, inputType});

        }
    }
});
