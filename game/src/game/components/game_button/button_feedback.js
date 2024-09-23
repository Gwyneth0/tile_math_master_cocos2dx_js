var ButtonFeedback = cc.class("ButtonFeedback", cc.Sprite, {
    ctor: function () {
        this._super();
        this.buttonFeedback();
        return true;
    },

    buttonFeedback: function () {
        var size = cc.view.getVisibleSize();
        var button = new cc.Sprite("#ms_rateus_button.png");
        button.attr({
            x: size.width / 2 - 100,
            y: size.height / 2 - 450,
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
            console.log("Feedback button clicked!");
            // this.popup.setVisible(false); // hide popup
            // this.setVisible(false);
            return true;
        }
        return false;
    }
});