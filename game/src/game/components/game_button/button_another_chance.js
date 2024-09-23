var ButtonAnOtherChance = cc.class("ButtonAnOtherChance", cc.Sprite, {

    ctor: function (){
        this._super();
        this.buttonRestart();
        return true;
    },

    buttonRestart: function () {
        var size = cc.view.getVisibleSize();
        var btnRes = new cc.Sprite("#another_chance_btn_1.png");

        btnRes.attr({
            x: size.width / 2 + 140,
            y: size.height / 2 - 150,
        });

        // button.addTouchEventListener(this.touchEvent, this);
        this.addChild(btnRes, 0);
    },

});