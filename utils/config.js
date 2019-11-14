import {NetworkConfig} from "../modules/network/network/index";

const Release = false;

const SoftwareVersion = `${Release?'':'HiBox_Stage '}1.6.5`;

const PostUrl = `https://backend.${Release?'':'stage.'}hipee.cn/hipee-web-hibreath/`;
const UploadUrl = 'https://backend.hipee.cn/hipee-upload/hibreath/mp/upload/image.do';

NetworkConfig.setConfig({postUrl: PostUrl});

export {
    PostUrl,
    UploadUrl,
    SoftwareVersion,
    Release
};
