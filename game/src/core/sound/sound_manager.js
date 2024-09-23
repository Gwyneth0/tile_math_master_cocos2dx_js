let SoundManager = cc.class("SoundManager", {

    isEnabled: true,

    MAX_BGM_VOLUME: 1.0,
    MAX_SFX_VOLUME: 1.0,

    ctor: function () {
        this.update(this.isEnabled);
    },

    update: function (enabled) {

        SoundHelper.getInstance().setEffectsVolume(enabled ? this.MAX_SFX_VOLUME : 0.0);
        SoundHelper.getInstance().setBackgroundMusicVolume(enabled ? this.MAX_BGM_VOLUME : 0.0);

        if (enabled) {
            SoundHelper.getInstance().resumeBackgroundMusic();
        } else {
            SoundHelper.getInstance().stopAllEffects();
            SoundHelper.getInstance().pauseBackgroundMusic();
        }

        if (SoundHelper.getInstance())
            SoundHelper.getInstance().toggleMusic(enabled);
    },

    playEffect: function (sound) {
        if (this.isEnabled)
            return SoundHelper.getInstance().playEffect(sound);
        return 0;
    },

    toggle: function () {
        this.isEnabled = !this.isEnabled;
        this.update(this.isEnabled);
    },

    playBackgroundMusic: function (music) {
        SoundHelper.getInstance().playBackgroundMusic(music, true);
    },

    stopBackgroundMusic: function () {
        SoundHelper.getInstance().stopBackgroundMusic();
    },

    pauseBackgroundMusic: function () {
        SoundHelper.getInstance().pauseBackgroundMusic();
    },

    resumeBackgroundMusic: function () {
        SoundHelper.getInstance().resumeBackgroundMusic();
    },

    stopAllEffects: function () {
        SoundHelper.getInstance().stopAllEffects();
    },

    exit: function () {
        SoundHelper.getInstance().stopBackgroundMusic(true);
        SoundHelper.getInstance().stopAllEffects();
    }
});

SoundManager.instance = null;
SoundManager.getInstance = function () {
    if (!SoundManager.instance) {
        SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
};

var Sound = SoundManager.getInstance();