var PopupAlertResult = {
    NONE: 0,
    ACCEPT: 1,
    REJECT: 2,
    CANCEL: 3
};

var PopupAlert = cc.class("PopupAlert", PopupBase, {

    ctor: function (options) {
        this._super(options);

        this.acceptCallback = null;
        this.cancelCallback = null;
        this.escCallback = null;
    },

    setTitle: function (text) {
        this.textTitle && this.textTitle.setString(text);
    },

    setContent: function (text) {
        this.textContent && this.textContent.setString(text);
    },

    setTextOk: function (text) {
        this.textOk && this.textOk.setString(text);
        NodeUtils.fitTextInside(this.textOk);
    },

    setTextAccept: function (text) {
        this.textAccept && this.textAccept.setString(text);
        NodeUtils.fitTextInside(this.textAccept);
    },

    setTextReject: function (text) {
        this.textReject && this.textReject.setString(text);
        NodeUtils.fitTextInside(this.textReject);
    },

    toggleMode: function (single) {

        this.buttonOk && this.buttonOk.setVisible(single);
        this.buttonOk && this.buttonOk.setEnabled(single);

        this.buttonAccept && this.buttonAccept.setVisible(!single);
        this.buttonAccept && this.buttonAccept.setEnabled(!single);

        this.buttonReject && this.buttonReject.setVisible(!single);
        this.buttonReject && this.buttonReject.setEnabled(!single);
    },

    toggleClose: function value(visible) {
        this.buttonClose.setVisible(visible && this.buttonOk.isVisible());
    },

    /**
     * Support these prototypes:
     * popup.showAlert(callback, callback);
     * popup.showAlert(options, callback, callback);
     * popup.showAlert(owner, options, callback, callback);
     * @param owner
     * @param options
     * @param acceptCallback
     * @param cancelCallback
     */
    showAlert: function (owner, options, acceptCallback, cancelCallback) {

        if (cc.isFunction(options)) {
            cancelCallback = acceptCallback;
            acceptCallback = options;
            options = owner;
            owner = null;
        } else if (cc.isFunction(owner)) {
            cancelCallback = options;
            acceptCallback = owner;
            options = null;
            owner = null;
        }

        this.acceptCallback = acceptCallback;
        this.cancelCallback = cancelCallback;
        this.escCallback = acceptCallback;

        this.setTitle(options.textTitle);
        this.setContent(options.textContent);
        this.setTextOk(options.textAccept);

        this.toggleMode(true);
        this.show(owner, options);
    },

    /**
     * Support these prototypes:
     * popup.showPrompt(callback, callback);
     * popup.showPrompt(options, callback, callback);
     * popup.showPrompt(owner, options, callback, callback);
     * @param owner
     * @param options
     * @param acceptCallback
     * @param cancelCallback
     */
    showPrompt: function (owner, options, acceptCallback, cancelCallback) {

        if (cc.isFunction(options)) {
            cancelCallback = acceptCallback;
            acceptCallback = options;
            options = owner;
            owner = null;
        } else if (cc.isFunction(owner)) {
            cancelCallback = options;
            acceptCallback = owner;
            options = null;
            owner = null;
        }

        this.acceptCallback = acceptCallback;
        this.cancelCallback = cancelCallback;
        this.escCallback = cancelCallback;

        this.setTitle(options.textTitle);
        this.setContent(options.textContent);
        this.setTextAccept(options.textAccept);
        this.setTextReject(options.textReject);

        this.toggleMode(false);
        this.show(owner, options);
    },

    onInit: function (options) {
        this._super(options);

        options = _.defaults(options, {
            json: ASSET_CORE.json_popup_alert,
            elements: {
                panelName: "panel",
                buttonOkName: "panel/button_ok",
                buttonCloseName: "panel/button_close",
                buttonAcceptName: "panel/button_accept",
                buttonRejectName: "panel/button_reject",
                textOkName: "panel/button_ok/text",
                textAcceptName: "panel/button_accept/text",
                textRejectName: "panel/button_reject/text",
                textTitleName: "panel/title/text",
                textContentName: "panel/content/text_message",
            },
        });

        let root = ccs.load(options.json);
        if (root && root.node) {

            let names = options.elements;

            this.addChild(root.node);

            this.panel = NodeUtils.findChildByPath(root.node, names.panelName);
            this.panel.setScale(AppUtils.getContentScale());

            this.textTitle = NodeUtils.findChildByPath(root.node, names.textTitleName);
            Localize.localizeText(this.textTitle);
            NodeUtils.fixTextLayout(this.textTitle);

            this.textContent = NodeUtils.findChildByPath(root.node, names.textContentName);
            Localize.localizeText(this.textContent);

            this.buttonOk = NodeUtils.findChildByPath(root.node, names.buttonOkName);
            if (this.buttonOk) {

                this.textOk = NodeUtils.findChildByPath(root.node, names.textOkName);
                this.textOk.setString(Localize.text("BUTTON_AGREE"));
                Localize.localizeText(this.textOk);
                NodeUtils.fixTextLayout(this.textOk);

                this.buttonOk.setVisible(false);

                this.buttonOk.baseScale = this.buttonOk.getScale();
                this.buttonOk.baseWidth = this.buttonOk.width;

                if (this.buttonOk instanceof ccui.Button)
                    this.buttonOk.setPressedActionEnabled(false);

                this.buttonOk.addTouchEventListener((sender, event) => {
                    if (NodeUtils.applyPressedEffect(sender, event, sender.baseScale || 1)) {
                        this.setCallback(this.acceptCallback);
                        this.hide(PopupAlertResult.ACCEPT);
                    }
                });
            }

            this.buttonAccept = NodeUtils.findChildByPath(root.node, names.buttonAcceptName);
            if (this.buttonAccept) {

                this.textAccept = NodeUtils.findChildByPath(root.node, names.textAcceptName);
                this.textAccept.setString(Localize.text("BUTTON_AGREE"));
                Localize.localizeText(this.textAccept);
                NodeUtils.fixTextLayout(this.textAccept);

                this.buttonAccept.setVisible(false);
                this.buttonAccept.setEnabled(false);

                this.buttonAccept.baseScale = this.buttonAccept.getScale();
                this.buttonAccept.baseWidth = this.buttonAccept.width;

                if (this.buttonAccept instanceof ccui.Button)
                    this.buttonAccept.setPressedActionEnabled(false);

                this.buttonAccept.addTouchEventListener((sender, event) => {
                    if (NodeUtils.applyPressedEffect(sender, event, sender.baseScale || 1)) {
                        this.setCallback(this.acceptCallback);
                        this.hide(PopupAlertResult.ACCEPT);
                    }
                });
            }

            this.buttonReject = NodeUtils.findChildByPath(root.node, names.buttonRejectName);
            if (this.buttonReject) {

                this.textReject = NodeUtils.findChildByPath(root.node, names.textRejectName);
                this.textReject.setString(Localize.text("BUTTON_DECLINE"));
                Localize.localizeText(this.textReject);
                NodeUtils.fixTextLayout(this.textReject);

                this.buttonReject.setVisible(false);
                this.buttonReject.setEnabled(false);

                this.buttonReject.baseScale = this.buttonReject.getScale();
                this.buttonReject.baseWidth = this.buttonReject.width;

                if (this.buttonReject instanceof ccui.Button)
                    this.buttonReject.setPressedActionEnabled(false);

                this.buttonReject.addTouchEventListener((sender, event) => {
                    if (NodeUtils.applyPressedEffect(sender, event, sender.baseScale || 1)) {
                        this.setCallback(this.cancelCallback);
                        this.hide(PopupAlertResult.REJECT);
                    }
                });
            }

            this.buttonClose = NodeUtils.findChildByPath(root.node, names.buttonCloseName);
            if (this.buttonClose) {
                this.buttonClose.setVisible(false);
                this.buttonClose.baseScale = this.buttonOk.getScale();
                this.buttonClose.addTouchEventListener((sender, event) => {
                    if (NodeUtils.applyPressedEffect(sender, event, sender.baseScale || 1)) {
                        this.setCallback(this.cancelCallback);
                        this.hide(PopupAlertResult.CANCEL);
                    }
                });
            }
        }
    },

    hideByEsc: function () {
        this._super();
        this.escCallback && this.escCallback();
        this.hide(PopupAlertResult.CANCEL);
    },

    onWillShow: function (owner, options) {
        return this._super(owner, options);
    },

    onDidShow: function () {
        this._super();
    },

    onWillHide: function (options) {

        if (options.useCoverAction === false)
            return false;

        let result = (cc.isObject(options) && options.coverTouched) ? PopupAlertResult.CANCEL : options;
        return this._super(result);
    },

    onDidHide: function (result) {
        this._super(result);
    },

    executeShow: function (owner, options, resolve) {
        this._super(owner, options, resolve);
        this.playEffectShowZoom({
            delay: options.delay || 0,
            instant: options.instant || false,
        }, resolve);
    },

    executeHide: function (options, resolve) {
        this._super(options, resolve);

        if (options.coverTouched)
            this.setCallback(this.cancelCallback);

        this.playEffectHideZoom({
            delay: options.delay || 0,
            instant: options.instant || false,
        }, resolve);
    },
});

// setup static functions

// options: {
//     name: "",
//     delay: 0,
//     zorder: 999,
//     unique: 0,
//     instant: false,
//     json: "",
//     elements: {
//         panelName: "panel",
//         buttonOkName: "panel/button_ok",
//         buttonCloseName: "panel/button_close",
//         buttonAcceptName: "panel/button_accept",
//         buttonRejectName: "panel/button_reject",
//         textOkName: "panel/button_ok/text",
//         textAcceptName: "panel/button_accept/text",
//         textRejectName: "panel/button_reject/text",
//         textTitleName: "panel/text_title",
//         textContentName: "panel/text_content",
//     },
//     textAccept: "Accept",
//     textTitle: "",
//     textContent: "",
// }
PopupAlert.showAlert = function (owner, options, acceptCallback = null, rejectCallback = null) {

    let parent = owner || cc.director.getRunningScene();
    if (!parent)
        return;

    let params = PopupBase.prepare(options, parent);
    if (!params)
        return;

    let popup = new PopupAlert(params);
    popup.setName(params.name);
    popup.showAlert(parent, params, acceptCallback, rejectCallback);

    return popup;
};

// options: {
//     name: "",
//     delay: 0,
//     zorder: 999,
//     unique: 0,
//     instant: false,
//     json: "",
//     elements: {
//         panelName: "panel",
//         buttonOkName: "panel/button_ok",
//         buttonCloseName: "panel/button_close",
//         buttonAcceptName: "panel/button_accept",
//         buttonRejectName: "panel/button_reject",
//         textOkName: "panel/button_ok/text",
//         textAcceptName: "panel/button_accept/text",
//         textRejectName: "panel/button_reject/text",
//         textTitleName: "panel/text_title",
//         textContentName: "panel/text_content",
//     },
//     textAccept: "Accept",
//     textReject: "Decline",
//     textTitle: "",
//     textContent: "",
// }
PopupAlert.showPrompt = function (owner, options, acceptCallback = null, rejectCallback = null) {

    let parent = owner || cc.director.getRunningScene();
    if (!parent)
        return;

    let params = PopupBase.prepare(options, parent);
    if (!params)
        return;

    let popup = new PopupAlert(params);
    popup.setName(params.name);
    popup.showPrompt(parent, params, acceptCallback, rejectCallback);

    return popup;
};