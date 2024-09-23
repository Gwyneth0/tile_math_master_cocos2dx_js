var ButtonGameBallSort = cc.class("ButtonGameBallSort", cc.Sprite, {
    ctor: function () {
        this._super();
        this.buttonGameBallSort();
        return true;
    },

    buttonGameBallSort: function () {
        var size = cc.view.getVisibleSize();
        var button = new cc.Sprite(SPRITES.lc_mini_game_1);
        button.attr({
            x: size.width / 2 ,
            y: size.height / 2 - 390,
        });

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true, // block input
            onTouchBegan: this.touchEvent.bind(this)
        });

        cc.eventManager.addListener(listener, button);

        this.addChild(button, 0);
    },

    touchEvent: function (touch, event) {
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var size = target.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);

        if (cc.rectContainsPoint(rect, locationInNode)) {
            console.log("Ball sort button clicked!");
            // this.popup.setVisible(false); // hide popup
            // this.setVisible(false);
            return true;
        }
        return false;
    }
});