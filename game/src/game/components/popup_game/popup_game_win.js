var PopupGameWin = cc.class("PopupGameWin", cc.Sprite, {
    ctor: function () {
        this._super();

        this.bgPopup();
        this.initMask();
        this.initMiniGameBoard();
        this.initLbBox();
        this.initButtGameBallSort();
        this.initButtonGameMoveBlock();
        this.initButtonGameTileSlide();
        this.initChest();
        this.initProgress();
        this.initButtonList();
        this.initButonRestart();
        this.initButtonNext();

        return true;
    },

    hidePopupGameWin: function () {
        this.setVisible(false);
    },

    bgPopup: function () {
        var size = cc.view.getVisibleSize();
        var bgPopup = new cc.Sprite(SPRITES.lvl_complete_pop);

        bgPopup.attr({
            x: size.width / 2,
            y: size.height / 2 + 150,
        });

        this.addChild(bgPopup, 2);
    },

    disableAllButtons: function () {
        cc.eventManager.removeListeners(this, true);
    },

    initButtonNext: function () {
        var buttonIconNext = new ButtonIconNext(this);
        this.addChild(buttonIconNext, 4);
    },

    initButonRestart: function () {
        var buttonIconRestart = new ButtonIconRestart();
        this.addChild(buttonIconRestart, 4);
    },

    initButtonList: function () {
        var buttonIconList = new ButtonIconList();
        this.addChild(buttonIconList, 4);
    },

    initMask: function () {
        var mask = new MaskDark();
        this.addChild(mask, 1);
    },

    initMiniGameBoard: function () {
        var gameBoard = new MiniGameBoard();
        this.addChild(gameBoard, 4);
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
    },

    initLbBox: function () {
        var lbBox = new LbBox();
        this.addChild(lbBox, 4)
    },

    initChest: function () {
        var chest = new Chest();
        this.addChild(chest, 4)
    },

    initProgress: function () {
        var progress = new Progess();
        this.addChild(progress, 3);
    }
});