var SoundHelper = cc.class("SoundHelper", {

    musicEnabled: false,
    soundEnabled: false,

    isMusicPlaying: false,
    activeMusicName: null,

    audioEngine: null,

    ctor: function () {

        this.musicEnabled = true;
        this.soundEnabled = true;

        this.isMusicPlaying = false;
        this.activeMusicName = "";

        this.audioEngine = cc.AudioEngine.getInstance();
    },

    preload: function (path) {
        this.audioEngine && this.audioEngine.preload(path);
    },

    toggleMusic: function (enabled) {
        this.musicEnabled = enabled;
    },

    toggleSound: function (enabled) {
        this.soundEnabled = enabled;
    },

    isMusicEnabled: function () {
        return this.musicEnabled;
    },

    isSoundEnabled: function () {
        return this.soundEnabled;
    },

    playBackgroundMusic: function (file, loop = true) {
        if (this.musicEnabled) {
            this.isMusicPlaying = true;
            this.activeMusicName = file;
            this.audioEngine && this.audioEngine.playMusic(file, loop);
        }
    },

    stopBackgroundMusic: function (name) {
        this.audioEngine && this.audioEngine.stopMusic(name);
        this.isMusicPlaying = false;
    },

    pauseBackgroundMusic: function () {
        this.audioEngine && this.audioEngine.pauseMusic();
    },

    resumeBackgroundMusic: function () {
        if (this.musicEnabled) {
            this.audioEngine && this.audioEngine.resumeMusic();
        }
    },

    playEffect: function (file, loop = false) {
        if (this.soundEnabled) {
            return this.audioEngine.playEffect(file, loop);
        }
        return 0;
    },

    setEffectsVolume: function (volume) {
        this.audioEngine && this.audioEngine.setEffectsVolume(volume);
    },

    getEffectsVolume: function () {
        return this.audioEngine.getEffectsVolume();
    },

    setBackgroundMusicVolume: function (volume) {
        this.audioEngine && this.audioEngine.setMusicVolume(volume);
    },

    getBackgroundMusicVolume: function () {
        return this.audioEngine.getBackgroundMusicVolume();
    },

    stopAllEffects: function () {
        this.audioEngine && this.audioEngine.stopAllEffects();
    }
});

SoundHelper.instance = null;
SoundHelper.getInstance = function () {
    if (!SoundHelper.instance) {
        SoundHelper.instance = new SoundHelper();
    }
    return SoundHelper.instance;
};