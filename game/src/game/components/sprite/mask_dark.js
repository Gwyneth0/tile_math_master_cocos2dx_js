var MaskDark = cc.class("MaskDark", cc.Sprite, {

    ctor: function () {
        this._super();
        this.Mask();
        return true;
    },

    Mask: function () {
        var size = cc.view.getVisibleSize();
        var spriteMask = new cc.Sprite(SPRITES.bg_blank);

        spriteMask.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 2
        });

        this.addChild(spriteMask, 0);
    },

});