var StorageTray = cc.class("StorageTray", cc.Sprite, {
    
    ctor: function () {
        this._super();
        this.createTray();
        return true;
    },

    createTray: function () {
        let size = cc.view.getVisibleSize();
        this.sprite = cc.Sprite(SPRITES.m_panel_big)
        this.setPosition(size.width / 2, size.height / 2 + 530);
        this.addChild(this.sprite,0);
    }
});