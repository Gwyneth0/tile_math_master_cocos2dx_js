var MainGame = cc.class("MainGame", cc.Scene, {
    onEnter: function () {
        this._super();

        var mainGameBg = new MainGameBg();
        this.addChild(mainGameBg, 1);

        var tileManager = new TileManager();
        this.addChild(tileManager, 2);

        this.popupMainGame = new PopupMainGame();
        this.addChild(this.popupMainGame, 3);

        var buttonPlay = new ButtonPlay(this.popupMainGame);
        this.addChild(buttonPlay, 4);

    }
});