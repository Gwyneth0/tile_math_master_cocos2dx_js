var LogoMainGame = cc.class("LogoMainGame", cc.Sprite, {
    ctor: function () {
        this._super();
        this.logoGame();
        return true;
    },

    logoGame: function () {
        let size = cc.view.getVisibleSize();
        this.sprite = new cc.Sprite(SPRITES.ms_title_a);

        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2 + 310,
        });

        this.addChild(this.sprite, 0); 

        // zoom scale logo
        var scaleUp = cc.scaleTo(1, 1.04).easing(cc.easeSineInOut()); 
        var scaleDown = cc.scaleTo(1, 1.0).easing(cc.easeSineInOut()); 
        var sequence = cc.sequence(scaleUp, scaleDown); 
        var repeatForever = cc.repeatForever(sequence); 
    
        this.sprite.runAction(repeatForever); 
    }
});
