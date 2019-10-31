import {WXDialog} from "heheda-common-view";
import Protocol from "../../modules/network/protocol";
import {previewImage} from "../../view/view";
import HiNavigator from "../../navigator/hi-navigator";

Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        message: {
            type: Object,
            value: {taskId: "", imgUrls: ['', '', '',], desc: '', messageCreateTime: '', headUrl: '', nickname: ''}
        }
    },

    data: {},
    lifetimes: {
        created() {

        },
        attached() {

        },
    },
    methods: {
        onMessageClickEvent() {
            HiNavigator.navigateToMessageDetail({messageId: this.data.message.id});
        },
        onMessageSettingEvent() {
            WXDialog.showDialog({
                content: '确定要删除此条动态吗？', showCancel: true, confirmEvent: async () => {
                    // await Protocol.postDynamicDelete({id: this.dataId});
                    this.triggerEvent('onMessageDeleteEvent', {taskId: this.data.message.taskId});
                }
            });
        },
        async onImagePreview(e) {
            const {currentTarget: {dataset: {url: current}}} = e;
            await previewImage({current, urls: this.data.message.imgUrls});
        }
    }
});
