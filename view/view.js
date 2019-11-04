export function showActionSheet({itemList,itemColor}) {
    return new Promise((resolve, reject) => {
        wx.showActionSheet({
            itemList,
            itemColor,
            success: resolve,
            fail: reject
        });
    });
}

export function previewImage({current, urls}) {
    return new Promise((resolve, reject) => {
        wx.previewImage({
            current, // 当前显示图片的http链接
            urls, // 需要预览的图片http链接列表
            success: resolve,
            fail: reject
        });
    });
}
