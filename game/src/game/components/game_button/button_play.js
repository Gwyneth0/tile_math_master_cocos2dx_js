var ButtonPlay = cc.class("ButtonPlay", cc.Sprite, {

    popupMainGame: null,

    ctor: function (popup) {
        this._super();
        this.popupMainGame = popup;
        this.buttonPlay();
        return true;
    },

    buttonPlay: function () {
        var size = cc.view.getVisibleSize();
        this.button = new cc.Sprite("#ms_play_btn.png");
        this.button.attr({
            x: size.width / 2,
            y: size.height / 2 - 50,
        });

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true, // block click out size
            onTouchBegan: this.touchEvent.bind(this)
        });

        this.listener = listener;

        cc.eventManager.addListener(listener, this.button);

        this.addChild(this.button, 0);

        // Zoom scale button
        var scaleUp = cc.scaleTo(1, 1.04).easing(cc.easeSineInOut());
        var scaleDown = cc.scaleTo(1, 1.0).easing(cc.easeSineInOut());
        var sequence = cc.sequence(scaleUp, scaleDown);
        var repeatForever = cc.repeatForever(sequence);
        this.button.runAction(repeatForever);
    },

    touchEvent: function (touch, event) {
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var size = target.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);

        if (cc.rectContainsPoint(rect, locationInNode)) {
            console.log("Play button clicked!");
            this.popupMainGame.setVisible(false); // hide popup
            this.setVisible(false);

            // Disable all buttons
            this.popupMainGame.disableAllButtons();

            // delete listener
            if (this.listener) {
                cc.eventManager.removeListener(this.listener);
            };

            return true;
        };

        return false;
    }
});
