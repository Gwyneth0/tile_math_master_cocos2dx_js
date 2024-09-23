var DESIGN_WIDTH = 1280;
var DESIGN_HEIGHT = 720;

var ScreenType = {
    RATIO_1609: 0,
    RATIO_1610: 1,
    RATIO_1710: 2,
    RATIO_0403: 3,
    RATIO_0302: 4,
    RATIO_0201: 5,
};

var ScreenSize = {};
ScreenSize[ScreenType.RATIO_1609] = cc.size(1280, 720);
ScreenSize[ScreenType.RATIO_1610] = cc.size(1280, 800);
ScreenSize[ScreenType.RATIO_1710] = cc.size(1024, 600);
ScreenSize[ScreenType.RATIO_0403] = cc.size(1024, 768);
ScreenSize[ScreenType.RATIO_0302] = cc.size(1440, 960);
ScreenSize[ScreenType.RATIO_0201] = cc.size(1280, 640);