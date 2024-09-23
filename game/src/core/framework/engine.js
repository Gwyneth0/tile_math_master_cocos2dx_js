"use strict";

var ccui = ccui || {};
ccui.WebView = ccui.WebView || {};

if (ccui.WebView.prototype) {
    ccui.WebView.prototype.loadURL = function (url) {
        if (url.indexOf("http://") >= 0 || url.indexOf("https://") >= 0) {
            this._loadURL(url);
        } else {
            this.loadFile(url);
        }
    };
}

ccui.WebView.openOnceTime = function (url, onExit, onError, parent = cc.director.getRunningScene()) {
    cc.log("WebView", "openOnceTime:", url);

    let webView = new ccui.WebView();
    webView.setScalesPageToFit(true);
    webView.setContentSize(cc.winSize.width, cc.winSize.height);
    webView.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.5);

    webView.loadTime = 0;

    webView.setOnShouldStartLoading(() => {
        cc.log("WebView", "loading");
        if (cc.sys.isObjectValid(webView) && webView.loadTime > 0) {
            cc.log("WebView", "close");

            webView.removeFromParent();
            webView = undefined;

            (typeof onExit === "function") && onExit();
        }
    });

    webView.setOnDidFinishLoading(() => {
        cc.log("WebView", "loaded");
        webView.loadTime++;
    });

    webView.setOnDidFailLoading((event) => {
        cc.log("WebView", "error", event);
        (typeof onError === "function") && onError(event);
    });

    parent.addChild(webView);
    webView.loadURL(url);

    return webView;
};

if (!cc.sys.isNative) {

    var cc = cc || {};

    cc.SpriteFrameCache = function () {

    };

    cc.SpriteFrameCache.getInstance = () => {
        return cc.spriteFrameCache;
    }

    cc.AudioEngine = function () {

    };

    cc.AudioEngine.getInstance = () => {
        return cc.audioEngine;
    }
}