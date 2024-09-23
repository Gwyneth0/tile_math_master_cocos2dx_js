var cc = cc || {};

cc.VEC2 = () => cc.p(0, 0);
cc.VEC2_ONE = () => cc.p(1, 1);

cc.ANCHOR_TOP_LEFT = () => cc.p(0, 1);
cc.ANCHOR_TOP_CENTER = () => cc.p(0.5, 1);
cc.ANCHOR_TOP_RIGHT = () => cc.p(1, 1);

cc.ANCHOR_CENTER = () => cc.p(0.5, 0.5);
cc.ANCHOR_MIDDLE_LEFT = () => cc.p(0, 0.5);
cc.ANCHOR_MIDDLE_RIGHT = () => cc.p(1, 0.5);

cc.ANCHOR_BOTTOM_LEFT = () => cc.p(0, 0);
cc.ANCHOR_BOTTOM_CENTER = () => cc.p(0.5, 0);
cc.ANCHOR_BOTTOM_RIGHT = () => cc.p(1, 0);

cc.SPRITE_FILE = function (name) { return new cc.Sprite(name); };
cc.SPRITE_FRAME = function (name) { return new cc.Sprite("#" + name); };

cc.formatStr = function () {

    let args = arguments;
    let l = args.length;
    if (l < 1)
        return "";

    let str = args[0];
    if (str === undefined)
        return;

    let needToFormat = true;
    if (typeof str === "object") {
        needToFormat = false;
    }

    for (let i = 1; i < l; ++i) {
        let arg = args[i];
        if (needToFormat) {
            while (true) {
                let result = null;
                if (typeof arg === "number") {
                    result = str.match(/(%d)|(%s)/);
                    if (result) {
                        str = str.replace(/(%d)|(%s)/, arg);
                        break;
                    }
                }
                if (typeof arg === "object") {
                    result = str.match(/(%j)|(%s)/);
                    if (result) {
                        str = str.replace(/(%j)|(%s)/, JSON.stringify(arg));
                        break;
                    }
                }
                result = str.match(/%s/);
                if (result)
                    str = str.replace(/%s/, arg);
                else
                    str += "    " + arg;
                break;
            }
        } else
            str += "    " + arg;
    }
    return str;
};

cc.class = function (name, base, object, statics) {

    cc.assert(arguments.length > 1, "Invalid number of arguments!");

    if (arguments.length === 3) {
        if (cc.isObject(name) && !cc.isString(name)) {
            // cc.class(base, object, statics)
            statics = object;
            object = base;
            base = name;
            name = "Class";
        }
    } else if (arguments.length === 2) {
        if (cc.isString(name)) {
            // cc.class(name, object)
            object = base;
            base = undefined;
        } else if (cc.isObject(name) && cc.isObject(base) && !cc.isString(base)) {
            // cc.class(object, base)
            object = base;
            base = name;
            name = "Class";
        }
    } else if (arguments.length === 1) {
        if (cc.isObject(name) && !cc.isString(name)) {
            // cc.class(object)
            object = name;
            name = "Class";
        }
    }

    if (base === undefined)
        base = cc.Class;

    cc.assert(cc.isString(name), "[name] param must be a string!");
    cc.assert(cc.isObject(object) || cc.isFunction(object), "[object] param must be an object!");
    cc.assert(cc.isObject(base) || cc.isFunction(base), "[base] param must be an object!");

    let result = base.extend(object);
    result.prototype._name = name;
    result.prototype._LOGTAG = "[" + name + "]";
    result.prototype._logLevel = 1;
    result.prototype.log = function () {
        if (this._logLevel > 0) {
            let args = Array.from(arguments);
            args.unshift(this._LOGTAG);
            cc.log.apply(null, args);
        }
    };

    result.prototype.setLogLevel = function (value) {
        this._logLevel = value;
    };

    // copy static props
    (statics || []).forEach((name) => {
        if (base.hasOwnProperty(name)) {
            result[name] = base[name];
        }
    });

    // fallback for old style classes
    result.prototype.LOGTAG = result.prototype._LOGTAG;

    return result;
};

cc.logTimes = {};

cc.logTime = function (key) {
    cc.logTimes[key] = cc.sys.now();
};

cc.logTimeEnd = function (key, tag) {
    if (cc.logTimes[key]) {
        cc.log(tag || "", key + " -> time: " + (cc.sys.now() - (cc.logTimes[key] || cc.sys.now())) + "ms");
        delete cc.logTimes[key];
    }
};