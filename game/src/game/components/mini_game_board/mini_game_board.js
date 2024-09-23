var MiniGameBoard = cc.class("MiniGameBoard", cc.Sprite, {
    ctor: function () {
        this._super();
        this.spriteGameBoard();
        return true;
    },

    spriteGameBoard: function () {
        var size = cc.view.getVisibleSize();
        var spriteBoard = new cc.Sprite(SPRITES.lc_mini_game_panel);
        spriteBoard.attr({
            x: size.width / 2,
            y: size.height / 2 - 370,
        });

        this.addChild(spriteBoard, 0);
    }
});