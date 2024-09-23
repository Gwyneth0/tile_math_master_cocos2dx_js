var PopupUnique = {
    NONE: 0,
    IGNORE_NEW: 1,          // Not create new popups if old ones does exist
    REMOVE_OLD: 2,          // Remove old popups if there's any
};

var PopupBase = cc.class("PopupBase", cc.Layer, {

    TIME_EFFECT_ZOOM: 0.3,
    TIME_EFFECT_SLIDE: 0.3,

    ctor: function (options) {
        this._super();

        options = _.defaults(options, {
            useCover: true,
            useModal: true,
            removeAfterHide: true,
            zorder: 1000
        });

        this.useCover = options.useCover;
        this.useModal = options.useModal;

        this.removeAfterHide = options.removeAfterHide;
        this.targetZOrder = options.zorder;

        this.didShowCallback = options.didShowCallback;
        this.didHideCallback = options.didHideCallback;

        this.willShowCallback = options.willShowCallback;
        this.willHideCallback = options.willHideCallback;

        this.cover = null;
        this.panel = null;

        this.callback = null;

        this.isBusy = false;
        this.isOpen = false;

        this.onInit(options);
        PopupBase.addPopup(this);
    },

    onEnter: function () {
        this._super();
    },

    onExit: function () {
        this._super();
    },

    /**
     * Called when popup start init
     * @param options
     */
    onInit: function (options) {

        if (options.useCover) {

            this.cover = new cc.LayerColor(cc.color.BLACK);
            this.addChild(this.cover);

            let listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: options.useModal,
                onTouchBegan: (sender, event) => true,
                onTouchEnded: (sender, event) => {
                    let params = _.assign(options, {coverTouched: true});
                    let willHide = this.onWillHide(params);
                    if (willHide) {
                        this.isBusy = true;
                        this.executeHide(params, this.onDidHide.bind(this));
                    }
                }
            });

            this.cover.setVisible(false);

            if (cc.sys.isNative) {
                this.cover.getEventDispatcher().addEventListenerWithSceneGraphPriority(listener, this.cover);
            }
            else {
                cc.eventManager.addListener(listener, this.cover);
            }
        }
    },

    /**
     * Called before popup is showing. Return true will allow to show popup.
     * @returns {boolean}
     */
    onWillShow: function (owner, options) {

        if (this.willShowCallback)
            this.willShowCallback(this);

        return !this.isBusy && !this.isOpen;
    },

    /**
     * Called after popup is shown
     * @returns {boolean}
     */
    onDidShow: function () {

        this.isBusy = false;
        this.isOpen = true;

        if (this.didShowCallback)
            this.didShowCallback(this);
    },

    /**
     * Called before popup is hiding. Return true will allow to hide popup.
     * @returns {boolean}
     */
    onWillHide: function (options) {

        if (this.willHideCallback)
            this.willHideCallback(this, options);

        return !this.isBusy && this.isOpen;
    },

    /**
     * Called after popup is hidden
     * @returns {boolean}
     */
    onDidHide: function (result) {

        this.isBusy = false;
        this.isOpen = false;

        if (this.didHideCallback)
            this.didHideCallback(this);

        if (this.callback)
            this.callback(this, result);

        if (cc.sys.isObjectValid(this) && this.removeAfterHide)
            this.removeFromParent();
    },

    executeShow: function (owner, options, resolve) {
        cc.assert("Must be overridden in child class");
        // TODO: Perform effect, and call resolve func
    },

    executeHide: function (options, resolve) {
        cc.assert("Must be overridden in child class");
        // TODO: Perform effect, and call resolve func
    },

    setPanel: function (node) {
        this.panel = node;
    },

    setCover: function (node) {
        this.cover = node;
    },

    setCallback: function (callback) {
        this.callback = callback;
    },

    show: function (owner, options) {

        let willShow = this.onWillShow(owner, options || {});
        if (!willShow)
            return;

        owner = owner || cc.director.getRunningScene();
        if (owner) {
            owner && owner.addChild(this, this.targetZOrder);
        }

        this.isBusy = true;
        this.executeShow(owner, options || {}, this.onDidShow.bind(this));
    },

    hide: function (options) {
        let willHide = this.onWillHide(options || {});
        if (willHide) {
            this.isBusy = true;
            this.executeHide(options || {}, this.onDidHide.bind(this));
        }
    },

    hideByEsc: function () {
    },

    showCover: function (instant = false) {

        if (!this.cover)
            return;

        if (instant) {
            this.cover.setOpacity(255);
            this.cover.setVisible(true);
        } else {
            this.cover.setOpacity(0);
            this.cover.runAction(cc.sequence(cc.show(), cc.fadeTo(0.2, 255 * 0.6)));
        }
    },

    hideCover: function (instant = false) {

        if (!cc.sys.isObjectValid(this.cover))
            return;

        if (instant) {
            this.cover.setOpacity(0);
            this.cover.setVisible(false);
        } else {
            this.cover.runAction(cc.sequence(cc.fadeTo(0.2, 0), cc.hide()));
        }
    },

    playEffectShowZoom: function (options, callback) {

        if (!this.panel || !(this.panel instanceof cc.Node)) {
            callback && callback(this);
            return;
        }

        options = _.defaults(options, {
            delay: 0,
            instant: false,
            scaleStart: 0.5,
            scaleTarget: 1.0,
            scaleBounce: 0.1,
        });

        this.showCover(options.instant);

        if (options.instant) {

            this.panel.stopAllActions();
            this.panel.setScale(options.scaleTarget);
            this.panel.setOpacity(255);
            this.panel.setVisible(true);

            callback && callback();

            return;
        }

        let scaleTo = new cc.EaseSineOut(cc.scaleTo(this.TIME_EFFECT_ZOOM * 0.5, options.scaleTarget + options.scaleBounce));
        let scaleBack = new cc.EaseSineOut(cc.scaleTo(this.TIME_EFFECT_ZOOM * 0.5, options.scaleTarget));

        let action = cc.sequence(cc.delayTime(options.delay), cc.show(), cc.spawn(cc.fadeIn(this.TIME_EFFECT_ZOOM * 0.5), cc.sequence(scaleTo, scaleBack)));
        if (callback)
            action = cc.sequence(action, cc.callFunc(callback));

        this.panel.setScale(options.scaleStart);
        this.panel.setPosition(cc.visibleRect.center);

        this.panel.setOpacity(0);
        this.panel.setVisible(false);

        this.panel.stopAllActions();
        this.panel.runAction(action);
    },

    playEffectHideZoom: function (options, callback) {

        options = _.defaults(options, {
            delay: 0,
            instant: false,
            scaleStart: null,
            scaleTarget: 0.5,
            scaleBounce: 0.1,
        });

        this.hideCover(options.instant);

        if (options.instant) {

            this.panel.stopAllActions();
            this.panel.setScale(options.scaleTarget);
            this.panel.setOpacity(0);
            this.panel.setVisible(false);

            callback && callback();

            return;
        }

        if (!cc.sys.isObjectValid(this.panel)) {
            callback && callback();
            return;
        }
        let scaleStart = options.scaleStart || this.panel.getScale();

        let scaleBack = new cc.EaseSineOut(cc.scaleTo(this.TIME_EFFECT_ZOOM * 0.5, scaleStart + options.scaleBounce));
        let scaleTo = new cc.EaseSineOut(cc.scaleTo(this.TIME_EFFECT_ZOOM * 0.5, options.scaleTarget));

        let action = cc.sequence(cc.delayTime(options.delay), cc.spawn(cc.fadeOut(this.TIME_EFFECT_ZOOM), cc.sequence(scaleBack, scaleTo)));
        if (callback)
            action = cc.sequence(action, cc.callFunc(callback));

        this.panel.setScale(scaleStart);

        this.panel.stopAllActions();
        this.panel.runAction(action);
    },

    playEffectShowSlide: function (options, callback) {

        if (!this.panel || !(this.panel instanceof cc.Node)) {
            callback && callback(this);
            return;
        }

        options = _.defaults(options, {
            instant: false,
            bounceOffset: 0,
        });

        this.showCover(options.instant);

        if (options.instant) {

            this.panel.stopAllActions();
            this.panel.setPosition(cc.visibleRect.center);

            callback && callback();

            return;
        }

        let moveTo = new cc.EaseSineOut(cc.moveTo(this.TIME_EFFECT_SLIDE * 2 / 3, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y - options.bounceOffset)));
        let moveBack = new cc.EaseSineOut(cc.moveTo(this.TIME_EFFECT_SLIDE * 1 / 3, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y)));

        if (!this.panel.startPosition)
            this.panel.startPosition = cc.p(cc.visibleRect.center.x, cc.visibleRect.height * 1.1 + this.panel.height * 0.5);

        let action = cc.sequence(cc.show(), moveTo, moveBack);
        if (callback)
            action = cc.sequence(action, cc.callFunc(callback));

        this.panel.setPosition(this.panel.startPosition);

        this.panel.stopAllActions();
        this.panel.runAction(action);
    },

    playEffectHideSlide: function (options, callback) {

        if (!this.panel || !(this.panel instanceof cc.Node)) {
            callback && callback(this);
            return;
        }

        options = _.defaults(options, {
            instant: false,
            bounceOffset: 0,
        });

        this.hideCover(options.instant);

        if (options.instant) {

            this.panel.stopAllActions();
            this.panel.setPosition(this.panel.startPosition);

            callback && callback();

            return;
        }

        let moveBack = new cc.EaseSineOut(cc.moveTo(this.TIME_EFFECT_SLIDE * 1 / 3, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y - options.bounceOffset)));
        let moveTo = new cc.EaseSineOut(cc.moveTo(this.TIME_EFFECT_SLIDE * 2 / 3, this.panel.startPosition));

        let action = cc.sequence(moveBack, moveTo, cc.hide());
        if (callback)
            action = cc.sequence(action, cc.callFunc(callback));

        this.panel.stopAllActions();
        this.panel.runAction(action);
    }
});

PopupBase.DEFAULT_NAME = "popup_base";
PopupBase.prepare = function (options, parent) {

    let params = _.defaults(options, {
        name: "",
        delay: 0,
        zorder: 1000,
        unique: 0,
    });

    if (params.name === "")
        params.name = (params.unique !== PopupUnique.NONE) ? PopupBase.DEFAULT_NAME : cc.formatStr("%s_%d", PopupBase.DEFAULT_NAME, Date.now());

    if (parent && cc.sys.isObjectValid(parent) && parent instanceof cc.Node) {
        if (params.unique === PopupUnique.REMOVE_OLD) {
            // remove old popup if there's any
            let child = parent.getChildByName(params.name);
            if (cc.sys.isObjectValid(child)) {
                child.removeFromParent();
            }
        } else if (params.unique === PopupUnique.IGNORE_NEW) {
            let child = parent.getChildByName(params.name);
            if (child) {
                // ignore new popup if old popup does exist
                return null;
            }
        }
    }

    // if params is null, don't show popup
    return params;
};

PopupBase.queuePopup = [];

PopupBase.getTopPopup = function () {
    if (!PopupBase.queuePopup || PopupBase.queuePopup.length == 0) {
        return null;
    }
    let run = 0;
    while (run < PopupBase.queuePopup.length) {
        if (!cc.sys.isObjectValid(PopupBase.queuePopup[run])) {
            PopupBase.queuePopup.splice(run, 1);
        }
        else run ++;
    }
    if(PopupBase.queuePopup.length > 0){
        return PopupBase.queuePopup[PopupBase.queuePopup.length -1];
    }
    return null;
};

PopupBase.addPopup = function (popup) {
    if (cc.sys.isObjectValid(popup)) {
        if (PopupBase.queuePopup.findIndex(x => x === popup) == -1) {
            PopupBase.queuePopup.push(popup);
        }
    }
};
