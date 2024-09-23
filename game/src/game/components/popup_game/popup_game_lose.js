var PopupGameLose = cc.class("PopupGameLose", cc.Sprite, {

    ctor: function () {
        this._super();

        this.initButtonRestart();
        this.initButtonAnotherChance();
        this.Star();
        this.bgPopup();
        this.initMask();
        this.initMiniGameBoard();
        this.initLabelPopupLose();
        this.initButtGameBallSort();
        this.initButtonGameMoveBlock();
        this.initButtonGameTileSlide();

        return true;
    },

    hidePopupGameLose: function () {
        this.setVisible(false);
    },

    disableAllButtons: function () {
        cc.eventManager.removeListeners(this, true);
    },

    bgPopup: function () {
        var size = cc.view.getVisibleSize();
        var bgPopup = new cc.Sprite(SPRITES.level_faile_pop);

        bgPopup.attr({
            x: size.width / 2,
            y: size.height / 2 + 150,
        });

        this.addChild(bgPopup, 2);
    },

    Star: function () {
        var size = cc.view.getVisibleSize();
        var star = new cc.Sprite(SPRITES.faile_star);

        star.attr({
            x: size.width / 2,
            y: size.height / 2 + 120,
        });
        this.addChild(star, 3);
    },

    buttonMatchADS: function () {
        var size = cc.view.getVisibleSize();
        this.btnADS = new cc.Sprite(SPRITES)
    },

    initButtonRestart: function () {
        var buttonRestart = new ButtonRestart(this);
        this.addChild(buttonRestart, 3);
    },

    initButtonAnotherChance: function () {
        var buttonAnotherChance = new ButtonAnOtherChance();
        this.addChild(buttonAnotherChance, 3);
    },

    // mask flank
    initMask: function () {
        var mask = new MaskDark();
        this.addChild(mask, 1);
    },

    initMiniGameBoard: function () {
        var gameBoard = new MiniGameBoard();
        this.addChild(gameBoard, 4);
    },

    initLabelPopupLose: function () {
        var label = new LabelPopupLose();
        this.addChild(label, 4);
    },

    initButtGameBallSort: function () {
        var ballSort = new ButtonGameBallSort();
        this.addChild(ballSort, 5);
    },

    initButtonGameMoveBlock: function () {
        var moveBlock = new ButtonGameMoveBlock();
        this.addChild(moveBlock, 5);
    },

    initButtonGameTileSlide: function () {
        var tileSlide = new ButtonGameTileSilde();
        this.addChild(tileSlide, 5);
    }
});