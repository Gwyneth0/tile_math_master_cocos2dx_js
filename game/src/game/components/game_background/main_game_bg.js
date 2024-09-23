var MainGameBg = cc.class("MainGameBg", cc.Sprite, {
    ctor: function () {
        this._super();
        this.mainGameBg();
        return true;
    },

    mainGameBg: function () {
        var size = cc.view.getVisibleSize();
        this.sprite = new cc.Sprite(SPRITES.bg_1);

        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
        });

        this.addChild(this.sprite, 0);
    }
}); 