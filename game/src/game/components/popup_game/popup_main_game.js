var PopupMainGame = cc.class("PopupMainGame", cc.Layer, {
    ctor: function () {
        this._super();

        this.initButtonChallenge();
        this.initButtonPlay();
        this.initLogo();
        this.initLeaf();
        this.initBgGame();
        this.initButtonFeedback();
        this.initButtonStore();
        this.initButtonMoreGame();
        this.initButtonMusic();
        this.initButtonSound();
        this.initButtonMiniGame();
        
        return true;
    },

    disableAllButtons: function () {
        cc.eventManager.removeListeners(this, true);
    },

    initBgGame: function () {
        var mainGameBg = new MainGameBg();
        this.addChild(mainGameBg, 1);
    },

    initButtonPlay: function () {
        var buttonPlay = new ButtonPlay(this);
        this.addChild(buttonPlay, 2);
    },

    initLogo: function () {
        var logoMaingame = new LogoMainGame();
        this.addChild(logoMaingame, 2);
    },

    initLeaf: function () {
        var leafSprite = new LeafSprite();
        this.addChild(leafSprite, 2);
    },

    initButtonChallenge: function () {
        var buttonChallenge = new ButtonChallenge();
        this.addChild(buttonChallenge, 2);
    },

    initButtonMusic: function () {
        var buttonMusic = new ButtonMusic();
        this.addChild(buttonMusic, 2);
    },

    initButtonFeedback: function () {
        var buttonFeedback = new ButtonFeedback();
        this.addChild(buttonFeedback, 3);
    },

    initButtonSound: function () {
        var buttonSound = new ButtonSound();
        this.addChild(buttonSound, 2);
    },

    initButtonStore: function () {
        var buttonStore = new ButtonStore();
        this.addChild(buttonStore, 2);
    },

    initButtonMoreGame: function () {
        var buttonMoreGame = new ButtonMoreGame();
        this.addChild(buttonMoreGame, 2);
    },

    initButtonMiniGame: function () {
        var buttonMiniGame = new ButtonMiniGame();
        this.addChild(buttonMiniGame, 2);
    }
});
