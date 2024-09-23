var ResourceLoader = cc.class("ResourceLoader", {

    ctor: function () {
        this.resources = [];
        this.spritesheets = [];
    },

    loadAssets: function (assets, onProgress = null, onComplete = null) {
        this.log("loadAssets", "assets: %j", assets);

        let files = [];

        assets = cc.isArray(assets) ? assets : _.values(assets);
        assets.forEach((item) => {
            if (typeof item === 'string')
                files.push(item);
            else if (typeof item === 'object') {
                files = files.concat(cc.isArray(item) ? item : _.values(item));
            }
        });

        this.resources = (this.resources || []).concat(files);
        cc.loader.load(this.resources, (unknown, assetCount, assetIndex) => {
            onProgress && onProgress(assetIndex + 1, assetCount);
        }, onComplete);
    },

    loadSpriteSheet: function (assets) {
        this.log("loadSpriteSheet", "assets: %j", assets);

        let spriteCache = cc.SpriteFrameCache.getInstance();

        let files = cc.isArray(assets) ? assets : [assets];
        files.forEach((file) => {
            spriteCache.addSpriteFrames(file);
        });

        this.spritesheets = (this.spritesheets || []).concat(files);
    },

    clear: function () {
        this.clearAssets();
        this.clearSpriteSheets();
    },

    clearAssets: function () {

        let textureCache = cc.TextureCache.getInstance();

        this.resources
            .filter(file => ['png', 'jpg', 'webp'].indexOf(cc.path.extname(file)) >= 0)
            .forEach((file) => {
                textureCache.removeTextureForKey(file);
            });

        this.resources.forEach(cc.loader.release);
    },

    clearSpriteSheets: function () {

        let spriteCache = cc.SpriteFrameCache.getInstance();

        this.spritesheets = this.spritesheets || [];
        this.spritesheets.forEach((file) => {
            spriteCache.removeSpriteFramesFromFile(file);
        });

        this.spritesheets.splice(0, this.spritesheets.length);
    },
});