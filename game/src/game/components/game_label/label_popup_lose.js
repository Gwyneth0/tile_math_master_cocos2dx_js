var LabelPopupLose = cc.class("LabelPopupLose", cc.Label, {

    ctor: function () {
        this._super();
        this.createLoseLabel();
        return true;
    },

    createLoseLabel: function () {
        var size = cc.view.getVisibleSize();
        var loseLabel = new cc.Sprite("#chance_tex.png");

        loseLabel.attr({
            x: size.width / 2,
            y: size.height / 2 - 10,
            scale: 1.3
            // color: cc.color(255, 0, 0) 
        });

        this.addChild(loseLabel, 3);
    },

});
