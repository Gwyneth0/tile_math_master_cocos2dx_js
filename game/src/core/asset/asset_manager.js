var AssetManager = cc.class("AssetManager", {

    ctor: function () {
        this.sessions = {};
    },

    session: function (key) {

        if (!this.sessions[key]) {
            this.sessions[key] = {
                asset: new ResourceLoader(),
                animation: new AnimationLoader()
            };
        }

        return this.sessions[key];
    },

    loadAssets: function (key, assets, onProgress = null, onComplete = null) {
        this.log("loadAssets key : ", key, " assets : ", assets);
        let session = this.session(key);
        if (session && session.asset)
            session.asset.loadAssets(assets, onProgress, onComplete);

        return this;
    },

    loadSpriteSheet: function (key, plist) {

        let session = this.session(key);
        if (session && session.asset)
            session.asset.loadSpriteSheet(plist);

        return this;
    },

    loadAnimations: function (key, definitions) {

        let session = this.session(key);
        if (session && session.animation)
            session.animation.loadDefines(definitions);

        return this;
    },

    getAnimation: function (key, name) {

        let session = this.session(key);
        if (session && session.animation)
            return session.animation.get(name);

        return null;
    },

    clear: function (key) {
        let session = this.session(key);
        if (session) {
            session.asset && session.asset.clear();
            session.animation && session.animation.clear();
        }
    },

    clearAll: function () {
        for (let key in this.sessions) {
            this.sessions[key].asset.clear();
            this.sessions[key].animation.clear();
            delete this.sessions[key];
        }
    }
});

AssetManager.instance = null;
AssetManager.getInstance = function () {
    if (!AssetManager.instance)
        AssetManager.instance = new AssetManager();
    return AssetManager.instance;
};

var Asset = AssetManager.getInstance();