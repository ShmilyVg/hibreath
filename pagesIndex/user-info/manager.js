import {UploadUrl} from "../../utils/config";

export function uploadFile({filePath}) {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: UploadUrl, filePath, name: filePath, success: res => {
                const data = JSON.parse(res.data);
                if (data && data.result && data.result.path) {
                    const imageUrl = data.result.path;
                    resolve(imageUrl);
                } else {
                    reject();
                }
            }, fail: reject
        });
    });
}

export function chooseImage() {
    return new Promise((resolve, reject) => {
        wx.chooseImage({
            count: 1, sizeType: ['compressed'], success: res => {
                const {tempFiles} = res;
                if (tempFiles.length) {
                    resolve(tempFiles[0].path);
                } else {
                    reject();
                }
            }, fail: reject
        })
    })
}

export function* entries(obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}
