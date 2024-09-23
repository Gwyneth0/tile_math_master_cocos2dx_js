var ButtonRestart = cc.class("ButtonRestart", cc.Sprite, {

    resetTile: null,
    popupGameLose: null,

    ctor: function (tile, popup) {
        this._super();
        this.resetTile = tile;
        this.popupGameLose = popup;
        this.buttonRestart();
        return true;
    },

    buttonRestart: function () {
        var size = cc.view.getVisibleSize();
        var btnRes = new cc.Sprite("#another_chance_btn_0.png");

        btnRes.attr({
            x: size.width / 2 - 140,
            y: size.height / 2 - 150,
        });

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true, // block input
            onTouchBegan: this.touchEvent.bind(this)
        });

        cc.eventManager.addListener(listener, btnRes);

        this.addChild(btnRes, 0);
    },

    touchEvent: function (touch, event) {
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var size = target.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);

        if (cc.rectContainsPoint(rect, locationInNode)) {
            console.log("ButtonRestart button clicked!");
            if (this.popupGameLose) {
                this.popupGameLose.hidePopupGameLose();
            }
            return true;
        }
        return false;
    }
});