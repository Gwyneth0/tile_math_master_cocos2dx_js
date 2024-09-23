if (!cc.sys.isNative) {

    var PortalEventManager = function () {

    };

    PortalEventManager.getInstance = function () {
        return new PortalEventManager();
    };
}

if (!cc.sys.isNative || PortalEventManager === undefined) {

    PortalEventManager = function () {

    };

    PortalEventManager.getInstance = function () {
        return new PortalEventManager();
    };
}

PortalEventManager.EVENT_EXT = "portal_ext";
PortalEventManager.EVENT_ERROR = "portal_error";

PortalEventManager.EVENT_PARAM_TYPE_NUMBER = 0;
PortalEventManager.EVENT_PARAM_TYPE_BOOLEAN = 1;
PortalEventManager.EVENT_PARAM_TYPE_STRING = 2;

PortalEventManager.getEventName = function (name) {
    return "jsb_" + name;
};

PortalEventManager.getEventData = function (payload) {

    let result = {};

    payload.split('|').filter(item => item !== '').forEach((param) => {
        let vars = param.split(':').filter(item => item !== '');
        if (vars.length >= 3) {
            let type = parseInt(vars[1]);
            let value = vars[2];
            switch (type) {
                case PortalEventManager.EVENT_PARAM_TYPE_NUMBER:
                    value = (vars[2] !== '') ? Number(vars[2]) : undefined;
                    break;
                case PortalEventManager.EVENT_PARAM_TYPE_BOOLEAN:
                    value = (vars[2] !== '') ? (Number(vars[2]) > 0) : undefined;
                    break;
            }
            result[vars[0]] = value;
        }
    });

    return result;
};

PortalEventManager.getEventJson = function (payload) {
    if (payload === undefined || payload === null || typeof payload !== 'string' || payload === '')
        return null;
    return JSON.parse(payload);
};

PortalEventManager.getInstance().onEvent = function (event) {
    cc.log("PortalEventManager.onEvent", "eventName:", event.eventName, "eventData : %s", event.eventData);
    let eventData = PortalEventManager.getEventJson(event.eventData);
    cc.eventManager.dispatchCustomEvent(PortalEventManager.getEventName(event.eventName), eventData);
};