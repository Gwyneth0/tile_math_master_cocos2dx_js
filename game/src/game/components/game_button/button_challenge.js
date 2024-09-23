var ButtonChallenge = cc.class("ButtonChallenge", cc.Sprite, {

    ctor: function () {
        this._super();
        this.buttonChallenge();

        return true;
    },

    buttonChallenge: function () {
        var size = cc.view.getVisibleSize();
        var button = new cc.Sprite("#ms_challenge_btn.png");
        button.attr({
            x: size.width / 2,
            y: size.height / 2 - 250,
        });

        // button.addTouchEventListener(this.touchEvent, this);
        this.addChild(button, 0);
        // this.sprite = button;
        // this.sprite.setVisible(false);

        // zoom scale button
        var scaleUp = cc.scaleTo(1, 1.02).easing(cc.easeSineInOut()); 
        var scaleDown = cc.scaleTo(1, 1.0).easing(cc.easeSineInOut()); 
        var sequence = cc.sequence(scaleUp, scaleDown); 
        var repeatForever = cc.repeatForever(sequence); 
    
        button.runAction(repeatForever); 
    },

    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                console.log("choosen challenge");
                break;
        };
    },
});