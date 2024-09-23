var LbBox = cc.class("LbBox", cc.Sprite, {
    ctor: function () {
        this._super();
        this.Box();
        return true;
    },

    Box: function () {
        var size = cc.view.getVisibleSize();
        var sprite = new cc.Sprite(SPRITES.lvl_box);

        sprite.attr({
            x: size.width / 2,
            y: size.height / 2 + 150,
        });

        this.addChild(sprite, 0);
    },
});