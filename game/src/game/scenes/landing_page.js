var LandingPageScene = cc.class("LandingPageScene", cc.Scene, {
    
    onEnter: function () {
        this._super();

        Asset.loadAssets("main", SPRITES, null, () => {
        });

        Asset.loadAssets("main", SPRITES_PLIST, null, () => {
            Asset.loadSpriteSheet("plist", SPRITES_PLIST.button);
            Asset.loadSpriteSheet("plist", SPRITES_PLIST.tile);
            Asset.loadSpriteSheet("plist", SPRITES_PLIST.themes);
            Asset.loadSpriteSheet("plist", SPRITES_PLIST.text);
            Asset.loadSpriteSheet("plist", SPRITES_PLIST.multipurpose);
            Asset.loadSpriteSheet("plist", SPRITES_PLIST.items);
        });

        var logoLanding = new LogoLandingPage();
        this.addChild(logoLanding);
    }
})