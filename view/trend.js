let charts = require('./wxcharts');

let _page = null;
let _data = null;
let lineChart = null;
let trendData = {};


function init(page) {
    _page = page;
    _data = page.data;
}

function setData(data) {
    trendData = data;
    normalTrend();
}

function initTouchHandler() {
    _page.touchHandler = function (e) {
        lineChart.scrollStart(e);
    };

    _page.moveHandler = function (e) {
        if (e) {
            lineChart.scroll(e);
        }
    };

    _page.touchEndHandler = function (e) {
        lineChart.scrollEnd(e);
        lineChart.showToolTip(e, {
            format: function (item) {
                return item.data
            }
        });
    };
}

function normalTrend() {
    let windowWidth = 370;
    let windowHeight = 200;
    try {
        let res = wx.getSystemInfoSync();
        windowWidth = 370 * res.windowWidth / 375;
        windowHeight = 200 * windowWidth / 370;
    } catch (e) {
        // do something when get system info failed
    }

    const {dataListX, dataListY, yAxisSplit} = trendData;

    lineChart = new charts({
        canvasId: 'lineCanvas',
        type: 'area',
        lineStyle: 'curve',
        categories: dataListX,
        series: [{
            type: 'calibration',
            data: dataListY,
            format: function (val) {
                return val;
            }
        }],
        legend: false,
        yAxis: {
            format: function (val) {
                return val;
            },
            min: 0,
            fontColor: '#9B9B9B'
        },
        xAxis: {
            fontColor: '#9B9B9B'
        },
        width: windowWidth,
        height: windowHeight,
        enableScroll: true,
        dataLabel: false,
        haveNum: true,
        yAxisSplit: yAxisSplit - 1,
        animation: false
    });
}

module.exports = {
    init: init,
    initTouchHandler: initTouchHandler,
    setData: setData,
};
