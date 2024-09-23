var ProgressBar = cc.class("ProgressBar", {

    ctor: function (barBase, barFull) {

        this.barBase = barBase;
        this.barFull = barFull;

        this.barBase.setVisible(false);
        this.barFull.setVisible(false);

        this.minWidth = barBase.width;
        this.maxWidth = barFull.width;

        this.percent = 0;
    },

    getPercent: function () {
        return this.percent;
    },

    setPercent: function (value) {

        this.percent = Math.min(Math.max(value, 0), 100);
        let width = this.percent * this.maxWidth / 100;

        this.barBase.setVisible(width <= this.minWidth);
        this.barFull.setVisible(width > this.minWidth);

        this.barBase.setPercent((width <= this.minWidth) ? (width * 100 / this.minWidth) : 100);
        this.barFull.width = width;
    },

    setVisible: function (value) {

        let width = this.percent * this.maxWidth / 100;

        this.barBase.setVisible(value && width <= this.minWidth);
        this.barFull.setVisible(value && width > this.minWidth);
    }
});