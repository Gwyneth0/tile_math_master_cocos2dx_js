var AppUtils = AppUtils || {};

AppUtils.setScreenType = function (type) {
    let size = ScreenSize[type] || ScreenSize[ScreenType.RATIO_1609];
    cc.view.setFrameSize(size.width, size.height);
};

AppUtils.getScreenType = function () {

    if (!AppUtils.screenType) {
        let aspectRatio = MathUtils.round(cc.visibleRect.width / cc.visibleRect.height, 4);
        let minTolerance = 9999;
        for (let key in ScreenSize) {
            let ratio = MathUtils.round(ScreenSize[key].width / ScreenSize[key].height, 4);
            let tolerance = Math.abs(aspectRatio - ratio);
            if (tolerance < minTolerance) {
                minTolerance = tolerance;
                AppUtils.screenType = key;
            }
        }
    }

    return AppUtils.screenType;
};

AppUtils.getContentScale = function () {
    return cc.visibleRect.height / DESIGN_HEIGHT;
};

AppUtils.getContentFitScale = function () {
    return Math.min(cc.visibleRect.height / DESIGN_HEIGHT, 1);
};

AppUtils.getContentFillScale = function () {
    return Math.max(cc.visibleRect.height / DESIGN_HEIGHT, 1);
};