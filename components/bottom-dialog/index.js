Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        list: {
            type: Array,
            value: []
        }
    },

    data: {
        showModalStatus: true,
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
            this.triggerEvent('onSubmitEvent', {...e.detail.value});

        }
    }
});
