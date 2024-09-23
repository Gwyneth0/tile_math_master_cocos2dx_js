var Chest = cc.class("Chest", cc.Sprite, {
    ctor: function () {
        this._super();
        this.Chest();
        return true;
    },

    Chest: function () {
        var size = cc.view.getVisibleSize();
        var sprite = new cc.Sprite(SPRITES.fo_progress_box);

        sprite.attr({
            x: size.width / 2 + 200,
            y: size.height / 2 ,
        });

        this.addChild(sprite, 0);
    },
});