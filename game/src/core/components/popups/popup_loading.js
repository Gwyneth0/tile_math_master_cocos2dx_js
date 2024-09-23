var PopupLoading = cc.class("PopupLoading", PopupBase, {

    ctor: function (options) {
        this._super(options);
    },

    setMessage: function (text) {
        this.textMessage && this.textMessage.setString(text);
    },

    toggleMode: function (full) {
        this.loader.setPosition(full ? this.loader.basePosition : cc.visibleRect.center);
        this.textMessage.setVisible(full);
    },

    show: function (owner, options) {
        this._super(owner, options);

        let params = _.defaults(options, {
            full: false,
            textMessage: Localize.text("key_prefix_loading")
        });

        this.toggleMode(params.full);
        this.setMessage(params.textMessage);
    },
    
    hideByEsc: function () {
    },

    onInit: function (options) {
        this._super(options);

        options = _.defaults(options, {
            json: ASSET_INIT.json_popup_waiting,
            elements: {
                loaderName: "loader",
                textMessageName: "text_message",
            },
        });

        let root = ccs.loadWithVisibleSize(options.json);
        if (root && root.node) {

            let names = options.elements;

            this.addChild(root.node);

            this.loader = NodeUtils.findChildByPath(root.node, names.loaderName);
            this.loader.basePosition = this.loader.getPosition();

            let loadingAnim = Asset.getAnimation(ASSET_KEY, "LOBBY_LOADING");
            this.loader.runAction(loadingAnim);

            this.textMessage = NodeUtils.findChildByPath(root.node, names.textMessageName);
            Localize.localizeText(this.textMessage);
            NodeUtils.fixTextLayout(this.textMessage);
        }
    },

    onWillShow: function (owner, options) {
        return this._super(owner, options);
    },

    onDidShow: function () {
        this._super();
    },

    onWillHide: function (options) {

        if (options.coverTouched) {

            if (this.willHideCallback)
                this.willHideCallback(this, options);
                
            // ignore hiding when cover touched
            return false;
        }

        return this._super(options);
    },

    onDidHide: function (result) {
        this._super(result);
    },

    executeShow: function (owner, options, resolve) {
        this._super(owner, options, resolve);
        this.showCover();
        resolve && resolve();
    },

    executeHide: function (options, resolve) {
        this._super(options, resolve);
        this.hideCover();
        resolve && resolve();
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
//         loaderName: "loader",
//         textMessageName: "text_message",
//     },
//     full: false,
//     textMessage: "Loading",
// }
PopupLoading.show = function (owner, options) {

    let parent = owner || cc.director.getRunningScene();
    if (!parent)
        return;
    options = _.defaults(options, {
        zorder: 3000
    });


    let params = PopupBase.prepare(options, parent);
    if (!params)
        return;

    let popup = new PopupLoading(params);
    popup.setName(params.name);
    popup.show(parent, params);

    return popup;
};