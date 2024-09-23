var AdMob;

if (cc.sys.isNative) {
    AdMob = AdsManager.getInstance();
}
else {
    AdMob = {

        showAdBanner: () => {},
        hideAdBanner: () => {},

        showAdRewardVideo: () => {},
        showAdInterstitial: () => {},

        isAdRewardVideoLoaded: () => false,
        isAdInterstitialLoaded: () => false,
        
        listenInitialized: () => {},
        listenUserDismissVideoAd: () => {},
        listenUserFinishedVideoAd: () => {},
    };
}

Object.defineProperties(AdMob, {

    onInitialized: {
        get: function () {
            return undefined;
        },
        set: function (value) {
            this.listenInitialized(value);
        }
    },

    onUserDismissVideoAd: {
        get: function () {
            return undefined;
        },
        set: function (value) {
            this.listenUserDismissVideoAd(value);
        }
    },

    onUserFinishedVideoAd: {
        get: function () {
            return undefined;
        },
        set: function (value) {
            this.listenUserFinishedVideoAd(value);
        }
    },
});

AdMob.setup = function () {
    cc.log("AdMob", "setup");

    AdMob.onInitialized = () => {
        cc.log("AdMob", "initialized");
    };

    AdMob.hideAdBanner();
};