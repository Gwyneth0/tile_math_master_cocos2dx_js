var ButtonIconRestart = cc.class("ButtonIconRestart", cc.Sprite, {

    tileManager: null,
    popupGamewin: null,

    ctor: function (tileManager) {
        this._super();
        this.tileManager = tileManager;
        this.buttonIconRestart();
        return true;
    },

    buttonIconRestart: function () {
        var size = cc.view.getVisibleSize();
        var btnRes = new cc.Sprite("#com_btn_1.png");

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
            console.log("ButtonIconRestart button clicked!");

            //  
            // if (this.tileManager) {
            //     this.tileManager.resetGame();
            // }

            return true;
        }
        return false;
    }
});