import {Toast as toast, WXDialog} from "heheda-common-view";
import Protocol from "../../modules/network/protocol";
import {previewImage,showActionSheet} from "../../view/view";
import HiNavigator from "../../navigator/hi-navigator";
import {getDynamicCreateTime} from "../../utils/time";

Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        message: {
            type: Object,
            value: {taskId: "", imgUrls: ['', '', '',], desc: '', createTimestamp: '', headUrl: '', nickname: ''}
        },
        scrollTopNum:{
            type: Number,
            value:0
        },
    },

    data: {

    },
    lifetimes: {
        created() {

        },
        attached() {

        },
    },
    pageLifetimes: {
        show() {

        },
        hide() {

        }
    },
    methods: {
        onMessageClickEvent() {
            HiNavigator.navigateToMessageDetail({messageId: this.data.message.id});
        },
        onMessageSettingEvent() {
            WXDialog.showDialog({
                content: '确定要删除此条动态吗？', showCancel: true, confirmEvent: async () => {
                     //await Protocol.postDynamicDelete({id: this.data.message.id});
                    this.triggerEvent('onMessageDeleteEvent', {taskId: this.data.message.id});
                }
            });
        },

        async onImagePreview(e) {
            this.triggerEvent('onNoupdate', {noUpdateAll: true});
            const {currentTarget: {dataset: {url: current}}} = e;
            await previewImage({current, urls: this.data.message.imgUrls});
        },

    }
});
