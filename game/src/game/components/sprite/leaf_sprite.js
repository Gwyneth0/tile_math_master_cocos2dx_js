var LeafSprite = cc.class("LeafSprite", cc.Sprite, {
    ctor: function () {
        this._super();
        this.leafTop();
        this.leafBottom();
        return true;
    },

    leafTop: function () {
        var size = cc.view.getVisibleSize();
        var leafTop = new cc.Sprite(SPRITES.ms_leaf_1);

        leafTop.attr({
            x: size.width / 2,
            y: size.height / 2 + 600,
        });

        this.addChild(leafTop, 0);
    },

    leafBottom: function () {
        var size = cc.view.getVisibleSize();
        var leafUnder = new cc.Sprite(SPRITES.ms_leaf_0);

        leafUnder.attr({
            x: size.width / 2,
            y: size.height / 2 - 500,
        });
        
        this.addChild(leafUnder, 0);
    }
});