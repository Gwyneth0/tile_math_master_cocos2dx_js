// Animation define format
// "anim_name": {
//     format: "res/anim_name/anim_frame_%d.png",       // frame format
//     start: 1,                                        // start frame index
//     end: 15,                                         // end frame index
//     duration: 0.8,                                   // duration of animation loop
//     loop: 0,                                         // animation repeat count
//     restore: true                                    // sprite will restore original frame after animation
// }

var AnimationLoader = cc.class("AnimationLoader", {

    ctor: function () {
        this.animations = [];
        this.definitions = {};
    },

    get: function (name) {
        let definition = this.definitions[name];
        if (definition)
            return this.loadAnimation(name, definition.duration, definition.format, definition.start, definition.end, definition.loop, 1, definition.restore || false);
        return null;
    },

    loadDefines: function (definitions) {
        this.definitions = definitions || this.definitions;
    },

    loadAnimation: function (name, duration, frameFormat, frameStart, frameEnd, loop = -1, step = 1, restore = false) {

        this.animations = this.animations || [];

        let animCache = cc.AnimationCache.getInstance();
        let animation = animCache.getAnimation(name);
        if (!animation) {

            let spriteCache = cc.SpriteFrameCache.getInstance();
            let spriteFrames = [];
            for (let i = frameStart; i <= frameEnd; i += step) {
                let spriteName = cc.formatStr(frameFormat, i);
                let frame = spriteCache.getSpriteFrame(spriteName);
                if (frame) {
                    spriteFrames.push(frame);
                } else {
                    spriteFrames.push((new cc.Sprite(spriteName)).getSpriteFrame());
                }
            }

            let frameDelay = (spriteFrames.length > 0) ? (duration / spriteFrames.length) : 0;
            animation = cc.Animation.createWithSpriteFrames(spriteFrames, frameDelay, 1);
            animCache.addAnimation(animation, name);

            this.animations.push(name);
        }

        if (animation) {
            animation.setLoops((loop > 1) ? loop : 1);
            animation.setRestoreOriginalFrame(restore);
        }

        return (loop <= 0) ? cc.repeatForever(cc.animate(animation)) : cc.animate(animation);
    },

    clear: function () {

        let animCache = cc.AnimationCache.getInstance();

        this.animations = this.animations || [];
        this.animations.forEach((name) => {
            animCache.removeAnimation(name);
        });

        this.animations.splice(0, this.animations.length);
        this.definitions.splice(0, this.definitions.length);
    },
});

