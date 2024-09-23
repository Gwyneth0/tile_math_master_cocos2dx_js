if (!cc.sys.isNative) {

    var PortalDownload = function () {

    };

    PortalDownload.getInstance = function () {
        return new PortalEventManager();
    };
}

PortalDownload.EVENT_DOWNLOAD_ABORTED = "event_portal_download_aborted";
PortalDownload.EVENT_DOWNLOAD_COMPLETED = "event_portal_download_completed";

PortalDownload.getInstance().onFileAborted = function (data) {
    cc.eventManager.dispatchCustomEvent(PortalDownload.EVENT_DOWNLOAD_ABORTED, data);
};

PortalDownload.getInstance().onFileCompleted = function (data) {
    cc.log("portalDownload.onFileCompleted JS %j", data);
    cc.eventManager.dispatchCustomEvent(PortalDownload.EVENT_DOWNLOAD_COMPLETED, data);
};