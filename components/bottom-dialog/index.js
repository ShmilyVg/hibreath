import {oneDigit} from "../../pages/food/manager";

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

        _bindInputEvent(e) {
            if (this.data.inputType !== 'digit') {
                return e.detail.value;
            }
            return oneDigit(e);
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
