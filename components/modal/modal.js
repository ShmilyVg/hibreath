import {WXDialog} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";
/**
 * 自定义modal浮层
 * 使用方法：
 * <modal show="{{showModal}}" height='60%' bindcancel="modalCancel" bindconfirm='modalConfirm'>
 <view>你自己需要展示的内容</view>
 </modal>

 属性说明：
 show： 控制modal显示与隐藏
 height：modal的高度
 bindcancel：点击取消按钮的回调函数
 bindconfirm：点击确定按钮的回调函数
 */

Component({

    /**
     * 组件的属性列表
     */
    properties: {
        //是否显示modal
        needCheckOTAUpdate: {
            type: Boolean,
            value: true
        },
        //modal的高度
        height: {
            type: String,
            value: ''
        },
        binUrl:{
            type: String,
            value: ''
        },
        datUrl:{
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        binUrl:"",
        datUrl:""
    },

    /**
     * 组件的方法列表
     */
    methods: {
        clickMask() {
            // this.setData({show: false})
        },

        cancel() {
            this.setData({ needCheckOTAUpdate: false })
            WXDialog.showDialog({
                content: '好的！本次您可以继续正常使用\n' + '下次在按键检测状态将再次提醒',
                confirmText: '我知道啦',

            })
        },

        confirm() {
            this.setData({ needCheckOTAUpdate: false })
           /* this.triggerEvent('confirm')*/
            HiNavigator.relaunchToUpdatePage({binUrl:this.data.binUrl, datUrl:this.data.datUrl});
        }
    }
})
