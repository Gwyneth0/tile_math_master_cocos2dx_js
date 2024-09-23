var TileManager = cc.class("TileManager", cc.Layer, {

    ctor: function () {
        this.tiles = [];
        this.selectedTiles = [];
        this.savedTiles = [];
        this.spacingX = -10;
        this.spacingY = -380;
        this.frameNames = this.getShuffledFrameNames();
        this.levelIndex = 0;
        this._super();
        this.createGrid(this.levelIndex);
        this.initStorageTray();
        return true;
    },

    // Get tile shuffled
    getShuffledFrameNames: function () {
        var frameNames = [];
        for (var i = 0; i < 32; i++) {
            // Add pairs for each frame
            frameNames.push("m_1_big_obj_" + i + ".png");
            frameNames.push("m_1_big_obj_" + i + ".png");
        };
        return this.shuffleArray(frameNames);
    },

    onGameWin: function () {
        console.log("Game win!");
        this.scheduleOnce(() => {
            this.levelIndex++;
            if (this.levelIndex < LEVELS_GAME.length) {
                console.log("Next levels");
                this.resetGame();
                this.createGrid(this.levelIndex);
            }
        }, 1);
    },


    resetGame: function () {
        this.unscheduleAllCallbacks();

        this.tiles.forEach((tile, index) => {
            if (tile && tile.getParent()) {
                tile.removeFromParent();
            };
        });

        this.tiles = [];
        this.selectedTiles = [];
        this.savedTiles = [];
    },

    createGrid: function (levelIndex) {

        cc.spriteFrameCache.addSpriteFrames(SPRITES_PLIST.tile);

        var size = cc.view.getVisibleSize();
        var cellWidth = (size.width - (7 - 1) * this.spacingX) / 7;
        var cellHeight = (size.height - (9 - 1) * this.spacingY) / 9;

        //  generate LEVELS_GAME
        var columnHeights = LEVELS_GAME[levelIndex][0]; // Base layer
        var columnHeightsHigh = LEVELS_GAME[levelIndex][1]; // High layer

        var frameIndex = 0; // check index in frameNames

        for (var col = 0; col < columnHeights.length; col++) {
            // Base layer
            var numRows = columnHeights[col];
            for (var row = 0; row < numRows; row++) {
                if (frameIndex < this.frameNames.length) {
                    var frameName = this.frameNames[frameIndex];
                    var frame = cc.spriteFrameCache.getSpriteFrame(frameName);
                    if (frame) {
                        this.createTile(row, col, cellWidth, cellHeight, frameName, frame, 1, 0);
                    };
                    frameIndex++;
                };
            };

            // High layer
            if (col < columnHeightsHigh.length) {
                var numRowsHigh = columnHeightsHigh[col];
                for (var row = 0; row < numRowsHigh; row++) {
                    if (frameIndex < this.frameNames.length) {
                        var frameName = this.frameNames[frameIndex];
                        var frame = cc.spriteFrameCache.getSpriteFrame(frameName);
                        if (frame) {
                            this.createTile(row, col, cellWidth, cellHeight, frameName, frame, 3, 0, 50);
                        };
                        frameIndex++;
                    };
                };
            };
        };

        // Check tile under bottom add mask
        this.checkOverlappingTiles();
    },

    createTile: function (row, col, cellWidth, cellHeight, frameName, frame, zIndex, xOffset, yOffset) {
        var offsetX = xOffset || 0;
        var offsetY = yOffset || 0;

        var bgTile = new cc.Sprite(SPRITES.mt_obj_box_big);
        var maskDark = new cc.Sprite(SPRITES.mt_obj_box_dark_big);

        bgTile.setPosition(
            col * (cellWidth + this.spacingX) + cellWidth / 2 + offsetX,
            row * (cellHeight + this.spacingY) + cellHeight / 2 + offsetY
        );

        maskDark.setPosition(bgTile.getPosition());
        maskDark.setVisible(false);
        // Set zIndex for mask
        this.addChild(maskDark, zIndex + 1);

        this.addChild(bgTile, zIndex);

        var sprite = new cc.Sprite(frame);
        sprite.setPosition(
            col * (cellWidth + this.spacingX) + cellWidth / 2 + offsetX,
            row * (cellHeight + this.spacingY) + cellHeight / 2 + offsetY
        );

        sprite.setUserData({ frameName: frameName, bgTile: bgTile, maskDark: maskDark });
        this.addTouchListener(sprite);
        this.tiles.push(sprite);
        this.addChild(sprite, zIndex + 1);
    },

    checkOverlappingTiles: function () {
        this.tiles.forEach((tile1, i) => {
            if (!tile1) {
                return; // Skip if tile1 null
            };

            const { maskDark: maskDark1 } = tile1.getUserData();
            if (!maskDark1) {
                return; // Skip if maskDark null
            };

            const pos1 = tile1.getPosition();
            const size1 = tile1.getContentSize();

            let isCovered = false;

            // Check overlap
            this.tiles.forEach((tile2, j) => {
                if (i === j || !tile2) {
                    return; // Skip tile or tile2 null
                };

                const { maskDark: maskDark2 } = tile2.getUserData();
                if (!maskDark2) {
                    return; // Skip if maskDark null
                };

                const pos2 = tile2.getPosition();
                const size2 = tile2.getContentSize();

                // Check for overlap between tile1 and tile2
                const overlap = Math.abs(pos1.x - pos2.x) < (size1.width / 2 + size2.width / 2) &&
                    Math.abs(pos1.y - pos2.y) < (size1.height / 2 + size2.height / 2);

                // Check z-order tile  
                if (overlap && tile2.getLocalZOrder() > tile1.getLocalZOrder()) {
                    isCovered = true;
                };
            });

            // Hide mask
            maskDark1.setVisible(isCovered);
        });
    },

    // Touch event
    addTouchListener: function (sprite) {
        sprite.setLocalZOrder(1);
        sprite.setAnchorPoint(0.5, 0.5);

        var touchEvent = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: (touch, event) => {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    this.onTileSelected(target);
                    return true;
                };

                return false;
            }
        });
        cc.eventManager.addListener(touchEvent, sprite);
    },

    // Select tile
    onTileSelected: function (tile) {
        var maskDark = tile.getUserData().maskDark;

        // Block click tile under have mask
        if (maskDark && maskDark.isVisible()) {
            console.log("Tile is blocked");
            return;
        };

        if (this.selectedTiles.length >= 5) {
            console.log("Game over");
            this.initPopupGameWin();
            return;
        };

        if (maskDark) {
            maskDark.removeFromParent();
        };

        // Remove tile 
        const tileIndex = this.tiles.indexOf(tile);
        if (tileIndex !== -1) {
            this.tiles.splice(tileIndex, 1);
        };

        this.selectedTiles.push(tile);

        // Check match 
        if (this.selectedTiles.length >= 2) {
            this.scheduleOnce(() => {
                this.checkMatch();
            }, 0.5);
        };

        this.checkOverlappingTiles();
        this.arrangeSelectedTiles();
    },

    checkMatch: function () {
        // Check tiles in selectedTiles
        for (var i = 0; i < this.selectedTiles.length - 1; i++) {
            for (var j = i + 1; j < this.selectedTiles.length; j++) {
                var tile1 = this.selectedTiles[i];
                var tile2 = this.selectedTiles[j];

                var frameName1 = tile1.getUserData().frameName;
                var frameName2 = tile2.getUserData().frameName;

                if (frameName1 === frameName2) {
                    this.handleTiles(tile1, tile2);

                    // Remove tiles from selectedTiles
                    this.selectedTiles.splice(j, 1);
                    this.selectedTiles.splice(i, 1);
                    i--; // Set new pos when removing tile

                    this.arrangeSelectedTiles();
                    break;
                };
            };
        };
    },

    arrangeSelectedTiles: function () {
        if (!this.storageTray || this.selectedTiles.length === 0) {
            return;
        };

        var basePos = this.storageTray.getPosition();
        var tileWidth = this.selectedTiles[0].getContentSize().width;
        var spacing = 0;

        // Rearrange tiles in the tray
        for (var i = 0; i < this.selectedTiles.length; i++) {
            var tile = this.selectedTiles[i];
            var newPos = cc.p(
                basePos.x - 200.5 + i * (tileWidth + spacing),
                basePos.y + 3
            );

            // Set z-order higher
            tile.setLocalZOrder(10);
            tile.getUserData().bgTile.setLocalZOrder(9);

            var moveAction = cc.moveTo(0.2, newPos);
            tile.stopAllActions();
            tile.getUserData().bgTile.stopAllActions();
            tile.runAction(moveAction);
            tile.getUserData().bgTile.runAction(moveAction.clone());
        };
    },

    handleTiles: function (tile1, tile2) {
        var frameName1 = tile1.getUserData().frameName;
        var frameName2 = tile2.getUserData().frameName;
        var matched = frameName1 === frameName2;

        var scaleAction = cc.scaleTo(0.2, 0.1);

        var scaleAction1 = scaleAction.clone();
        var scaleAction2 = scaleAction.clone();

        var spawnAction = cc.spawn(scaleAction1, scaleAction2);

        tile1.runAction(spawnAction);
        tile2.runAction(spawnAction.clone());

        this.handleTilePair(matched, [tile1, tile2]);
        this.saveSelectedTiles(frameName1, frameName2, matched);

        if (this.tiles.length === 0) {
            this.showPopupGameWin();
        }
    },

    showPopupGameWin: function () {
        console.log("Game win!");
        // this.initPopupGameWin();
        this.initPopupGameWin();
    },

    handleTilePair: function (isMatched, tiles) {
        tiles.forEach(tile => {
            tile.getUserData().bgTile.setVisible(!isMatched);
            if (isMatched) {
                // Remove tile
                this.scheduleOnce(() => {
                    tile.removeFromParent();
                }, 0.2);
            };
        });
    },

    // Save tile choose in arr
    saveSelectedTiles: function (frameName1, frameName2, isMatched) {
        if (isMatched) {
            this.savedTiles.push(frameName1);
            this.savedTiles.push(frameName2);
            this.checkForDuplicates(); // Check same
        };
    },

    checkForDuplicates: function () {
        var frameCount = {};
        var duplicates = [];

        // Count occurrences of each frame in savedTiles
        for (var i = 0; i < this.savedTiles.length; i++) {
            var frameName = this.savedTiles[i];
            if (frameCount[frameName]) {
                frameCount[frameName]++;
            } else {
                frameCount[frameName] = 1;
            };
        };

        // Find any frame that appear more than once
        for (var frameName in frameCount) {
            if (frameCount[frameName] > 1) {
                duplicates.push(frameName);
            };
        };
    },

    initStorageTray: function () {
        this.storageTray = new StorageTray();
        this.addChild(this.storageTray, 0);
    },

    initPopupGameWin: function () {
        var popupGameWin = new PopupGameWin();
        this.addChild(popupGameWin, 6);

        var buttonNext = new ButtonIconNext(popupGameWin, this);
        this.addChild(buttonNext, 7);
    },

    initPopupGameLose: function () {
        var popupGameLose = new PopupGameLose();
        this.addChild(popupGameLose, 10);
    },

    // Shuffle array
    shuffleArray: function (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        };

        return array;
    },

})