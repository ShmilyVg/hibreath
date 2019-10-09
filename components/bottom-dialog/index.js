Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        list: {
            type: Array,
            value: [
                {
                    id: 'high',
                    title: '高压(mmHg)',
                    placeholder: '请输入您的高压',
                    type: 'high'
                },
                {
                    id: 'low',
                    title: '低压(mmHg)',
                    placeholder: '请输入您的低压',
                    type: 'low'
                }]
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
            })
        },
        formSubmit(e) {
            console.log(e.detail.value);

        }
    }
});
