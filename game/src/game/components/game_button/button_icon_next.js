var ButtonIconNext = cc.class("ButtonIconNext", cc.Sprite, {
    popupGamewin: null,
    tileManager: null,

    ctor: function (popupGamewin, tileManager) {
        this._super();
        this.popupGamewin = popupGamewin;
        this.tileManager = tileManager;
        this.buttonIconNext();
        return true;
    },

    buttonIconNext: function () {
        var size = cc.view.getVisibleSize();
        var button = new cc.Sprite("#com_btn_2.png");
        button.attr({
            x: size.width / 2 + 150,
            y: size.height / 2 - 150,
        });

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true, // block input
            onTouchBegan: this.touchEvent.bind(this)
        });

        this.listener = listener;

        cc.eventManager.addListener(listener, this.button);

        this.addChild(button, 0);
    },

    touchEvent: function (touch, event) {
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var size = target.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);

        if (cc.rectContainsPoint(rect, locationInNode)) {
            console.log("ButtonIconNext button clicked!");

            if (this.popupGamewin) {
                this.popupGamewin.disableAllButtons();
                this.popupGamewin.hidePopupGameWin();
            };

            if (this.tileManager) {
                this.tileManager.onGameWin();
                this.setVisible(false);
            };

            if (this.listener) {
                cc.eventManager.removeListener(this.listener);
            };
            return true;
        };
        return false;
    }
});
