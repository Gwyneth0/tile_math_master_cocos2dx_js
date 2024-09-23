var Progess = cc.class("Progess", cc.Sprite, {
    ctor: function () {
        this._super();
        this.Progess();
        this.progessBack();
        return true;
    },

    progessBack: function () {
        var size = cc.view.getVisibleSize();
        var sprite = new cc.Sprite(SPRITES.lvl_progress_back);

        sprite.attr({
            x: size.width / 2 - 30,
            y: size.height / 2,
        });

        this.addChild(sprite, 0);
    },

    Progess: function () {
        var size = cc.view.getVisibleSize();
        var sprite = new cc.Sprite(SPRITES.lvl_progress);

        sprite.attr({
            x: size.width / 2 - 30,
            y: size.height / 2,
        });

        this.addChild(sprite, 0);
    },
});