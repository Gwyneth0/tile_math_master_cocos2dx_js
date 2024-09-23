var LogoLandingPage = cc.class("LogoLandingPage", cc.Sprite, {
    ctor: function () {
        this._super();
        this.logoLanding();
        return true;
    },

    logoLanding: function () {
        var size = cc.view.getVisibleSize();
        this.sprite = new cc.Sprite(SPRITES.portrait_splash_screen_logo);

        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
        });

        this.addChild(this.sprite, 0);

        this.scheduleOnce(() => {
            var fadeOut = cc.fadeOut(0.5);
            var callback = cc.callFunc(() => {
                cc.director.runScene(new MainGame());
            });
            
            this.sprite.runAction(cc.sequence(fadeOut, callback));
        }, 1);
    }
});
