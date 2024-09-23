var NodeUtils = NodeUtils || {};

NodeUtils.switchParent = function (node, newParent, newZOrder) {
    if (node && newParent) {
        if (node.getParent()) {
            node.retain();
            node.removeFromParent(false);
            if (newZOrder)
                newParent.addChild(node, newZOrder);
            else
                newParent.addChild(node);
            node.release();
        } else {
            if (newZOrder)
                newParent.addChild(node, newZOrder);
            else
                newParent.addChild(node);
        }
    }
};

NodeUtils.fitTextInside = function (text, container) {

    if (!text)
        return;

    container = container || text.getParent();
    if (!container)
        return;

    container.setContentSize(cc.size(Math.max(text.width + 40, container.baseWidth || 0), container.height));
    text.setPositionX(container.width * 0.5);
};

NodeUtils.fixTextLayout = function (widget, recursive = true, excludes = []) {
    if (widget == null)
        return;

    if (widget instanceof ccui.Text) {
        if (excludes.findIndex(item => item === widget.name) >= 0)
            return;
        widget.ignoreContentAdaptWithSize(true);
    } else if (recursive === true) {
        let children = widget.getChildren();
        children.forEach((child) => {
            NodeUtils.fixTextLayout(child, recursive, excludes);
        });
    }
};

NodeUtils.attachTextField = function (frame, options) {

    options = _.defaults(options, {
        texture: "",
        fontName: "Arial",
        fontSize: 24,
        fontColor: cc.color.WHITE,
        maxLength: 50,
        placeHolderText: "",
        placeHolderFontName: "",
        placeHolderFontSize: 24,
        placeHolderFontColor: cc.color.WHITE,
        paddingVertical: 0,
        paddingHorizontal: 0,
        inputFlag: cc.EDITBOX_INPUT_FLAG_SENSITIVE,
        inputMode: cc.EDITBOX_INPUT_MODE_SINGLELINE,
        returnType: cc.KEYBOARD_RETURNTYPE_DONE,
    });

    let size = frame.getContentSize();
    let inputBox = new cc.EditBox(cc.size(size.width - options.paddingHorizontal * 2, size.height - options.paddingVertical * 2), options.texture);
    frame.addChild(inputBox);

    inputBox.setPosition(cc.p(options.paddingHorizontal, 0));
    inputBox.setAnchorPoint(cc.p(0, 0));

    inputBox.setFontSize(options.fontSize);
    inputBox.setFontName(options.fontName);
    inputBox.setFontColor(options.fontColor);

    inputBox.setPlaceHolder(options.placeHolderText);
    inputBox.setPlaceholderFontName(options.placeHolderFontName);
    inputBox.setPlaceholderFontSize(options.placeHolderFontSize);
    inputBox.setPlaceholderFontColor(options.placeHolderFontColor);

    inputBox.setMaxLength(options.maxLength);
    inputBox.setReturnType(options.returnType);

    inputBox.setInputFlag(options.inputFlag);
    inputBox.setInputMode(options.inputMode);

    return inputBox;
};

NodeUtils.blinkNode = function (node, color, time, count, cascade = false) {

    if (!node || !cc.sys.isObjectValid(node))
        return;

    if (cascade)
        NodeUtils.setNodeCascade(node, true, true);

    node.runAction(cc.repeat(cc.sequence(cc.tintTo(time * 0.5, color.r, color.g, color.b), cc.tintTo(time * 0.5, 255, 255, 255)), count));
};

NodeUtils.captureNode = function (node, size, anchor, scale = 1, pixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA8888) {

    if (!node || !cc.sys.isObjectValid(node))
        return null;

    let savedPos = node.getPosition();
    node.setPosition(cc.p(size.width * anchor.x, size.height * anchor.height));

    let renderer = new cc.RenderTexture(size.width, size.height, pixelFormat, gl.DEPTH24_STENCIL8_OES);
    renderer.setPosition(cc.visibleRect.center);
    renderer.beginWithClear(255, 255, 255, 255);
    node.visit();
    renderer.end();

    node.setPosition(savedPos);

    if (scale === 1)
        return renderer;

    let sprite = renderer.getSprite();
    let resizeRenderer = new cc.RenderTexture(sprite.width * scale, sprite.height * scale, pixelFormat, gl.DEPTH24_STENCIL8_OES);

    sprite.setAnchorPoint(cc.p(0, 0));
    sprite.setFlippedY(true);
    sprite.setScale(scale);

    resizeRenderer.beginWithClear(255, 255, 255, 255);
    sprite.visit();
    resizeRenderer.end();

    return renderer;
};

NodeUtils.captureScreen = function (scale = 1, pixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA8888) {

    let renderer = new cc.RenderTexture(cc.visibleRect.width, cc.visibleRect.height, pixelFormat, gl.DEPTH24_STENCIL8_OES);
    renderer.setPosition(cc.visibleRect.center);
    renderer.beginWithClear(255, 255, 255, 255);
    cc.director.getRunningScene().visit();
    renderer.end();

    if (scale === 1)
        return renderer;

    let sprite = renderer.getSprite();
    let resizeRenderer = new cc.RenderTexture(sprite.width * scale, sprite.height * scale, pixelFormat, gl.DEPTH24_STENCIL8_OES);

    sprite.setAnchorPoint(cc.p(0, 0));
    sprite.setFlippedY(true);
    sprite.setScale(scale);

    resizeRenderer.beginWithClear(255, 255, 255, 255);
    sprite.visit();
    resizeRenderer.end();

    return renderer;
};

NodeUtils.captureScreenToFile = function (filename, scale = 1, pixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA8888, imageFormat = cc.IMAGE_FORMAT_PNG) {

    let renderer = NodeUtils.captureScreen(scale, pixelFormat);
    if (renderer) {
        let success = renderer.saveToFile(filename, imageFormat);
        if (success) {
            return cc.path.join(jsb.fileUtils.getWritablePath(), filename);
        }
    }

    return "";
};

NodeUtils.captureNodeToSprite = function (node, size, anchor, scale = 1, pixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA8888) {
    let renderer = NodeUtils.captureNode(node, size, anchor, scale, pixelFormat);
    return (renderer) ? renderer.getSprite() : null;
};

NodeUtils.captureScreenToSprite = function (scale = 1, pixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA8888) {
    let renderer = NodeUtils.captureScreen(scale, pixelFormat);
    return (renderer) ? renderer.getSprite() : null;
};

NodeUtils.captureScreenToBase64 = function (scale = 1, pixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA8888, callback = null) {
    let renderer = NodeUtils.captureScreen(scale, pixelFormat);
    if (renderer) {
        const fileName = "capture.png";
        let success = renderer.saveToFile(fileName, cc.IMAGE_FORMAT_PNG);
        if (success) {
            let path = cc.path.join(jsb.fileUtils.getWritablePath(), fileName);
            let interval = setInterval(() => {
                if (jsb.fileUtils.isFileExist(path)) {
                    clearInterval(interval);
                    let data = jsb.fileUtils.getDataFromFile(path);
                    callback && callback(TypeUtils.bufferToBase64(data));
                }
            }, 100);
        }
    }
};

NodeUtils.saveTextureToFile = function (texture, filename, callback) {

    if (!texture)
        return false;

    if (!filename || filename === '')
        return false;

    let sprite = new cc.Sprite();
    sprite.retain();

    if (!sprite.initWithTexture(texture)) {
        sprite.release();
        return false;
    }

    let size = cc.size(texture.getPixelsWide(), texture.getPixelsHigh());

    var renderer = new cc.RenderTexture(size.width, size.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888);
    renderer.retain();

    sprite.setPosition(size.width / 2, size.width / 2);

    renderer.begin();
    renderer.setSprite(sprite);
    renderer.visit();
    renderer.end();

    renderer.saveToFile(filename, cc.IMAGE_FORMAT_PNG, true, (texture, path) => {
        callback && callback(path);
    });

    renderer.release();
    sprite.release();

    return true;
};

NodeUtils.scaleSprite = function (size, sprite, fit = true, padding = 3) {

    if (!sprite || !cc.sys.isObjectValid(sprite))
        return;

    let scaleX = (size.width - padding * 2) / sprite.getContentSize().width;
    let scaleY = (size.height - padding * 2) / sprite.getContentSize().height;

    if (fit)
        sprite.setScale(scaleX, scaleY);
    else
        sprite.setScale(Math.max(scaleX, scaleY));
};

NodeUtils.updateSprite = function (size, sprite, texture, fit = true, padding = 0) {

    if (!sprite || !cc.sys.isObjectValid(sprite))
        return;

    if (!texture || !cc.sys.isObjectValid(texture) || !(texture instanceof cc.Texture2D))
        return;

    let scaleX = (size.width - padding * 2) / texture.getContentSize().width;
    let scaleY = (size.height - padding * 2) / texture.getContentSize().height;

    sprite.initWithTexture(texture);
    sprite.setVisible(true);

    if (fit)
        sprite.setScale(scaleX, scaleY);
    else
        sprite.setScale(Math.max(scaleX, scaleY));
};

NodeUtils.makeMaskedSprite = function (mask, url, zorder = -1, isFlip = false) {

    if (!mask || !mask.getParent())
        return;

    let parent = mask.getParent();
    let maskPosition = mask.getPosition();

    mask.retain();
    mask.setPosition(cc.p(0, 0));
    mask.removeFromParent();

    let avatarSprite = null;
    if (cc.spriteFrameCache.getSpriteFrame(url))
        avatarSprite = new cc.Sprite("#" + url);
    if (!avatarSprite)
        avatarSprite = new cc.Sprite(url);

    let scaleWidth = mask.width / avatarSprite.width;
    let scaleHeight = mask.height / avatarSprite.height;

    avatarSprite.setScale(Math.max(scaleWidth, scaleHeight));
    avatarSprite.setScaleX((isFlip) ? -avatarSprite.getScaleX() : avatarSprite.getScaleX());

    let clipper = new cc.ClippingNode();
    clipper.setStencil(mask);
    clipper.setAlphaThreshold(0.5);
    clipper.addChild(avatarSprite);
    clipper.setPosition(maskPosition);
    parent.addChild(clipper, zorder);

    let maskBox = mask.getBoundingBox();
    avatarSprite.setPosition(cc.p(cc.rectGetMidX(maskBox), cc.rectGetMidY(maskBox)));

    mask.release();

    return avatarSprite;
};

NodeUtils.applyPressedEffect = function (button, type, scale, deltaScale = 0.9, limitTime = 300, limitDist = 30) {

    if (!button)
        return false;

    let scaleX = scale.x || scale;
    let scaleY = scale.y || scale;

    if (type === ccui.Widget.TOUCH_BEGAN) {
        button.setScale(scaleX, scaleY);
        button.runAction(cc.scaleTo(0.1, scaleX * deltaScale, scaleY * deltaScale));
        button.touchBeganTime = Date.now();
        button.touchPosition = button.getTouchBeganPosition();
        return false;
    } else if (type === ccui.Widget.TOUCH_MOVED) {
        return false;
    } else if (type === ccui.Widget.TOUCH_CANCELED) {
        button.setScale(scaleX * deltaScale, scaleY * deltaScale);
        button.runAction(new cc.EaseBackOut(cc.scaleTo(0.3, scaleX, scaleY)));
        return false;
    }

    button.setScale(scaleX * deltaScale, scaleY * deltaScale);
    button.runAction(new cc.EaseBackOut(cc.scaleTo(0.3, scaleX, scaleY)));

    return (Date.now() - button.touchBeganTime) < limitTime && cc.pLength(cc.pSub(button.getTouchEndPosition(), button.touchPosition)) <= limitDist;
};

NodeUtils.applyGreyscaleNode = function (node, enabled = true, color = cc.color(100, 100, 100, 100)) {

    if (!node)
        return;

    if (node instanceof cc.ProgressTimer || node instanceof ccui.Button || node instanceof ccui.Text)
        return;

    if (node.getVirtualRenderer !== undefined) {
        let renderer = node.getVirtualRenderer();
        if (renderer) {
            if (renderer instanceof cc.Scale9Sprite) {
                renderer.setState((enabled) ? 1 : 0);
            } else {
                renderer.setColor((enabled === true) ? cc.color.WHITE : color);
            }
        }
    } else {
        node.setColor((enabled === true) ? cc.color.WHITE : color);
    }
};

NodeUtils.setWidgetEnabled = function (widget, enabled, greyscale = true) {
    if (!widget || !widget.setEnabled)
        return;

    widget.setEnabled(enabled);
    if (greyscale)
        NodeUtils.applyGreyscaleNode(widget, !enabled);
};

NodeUtils.setNodeCascade = function (node, colorEnabled, opacityEnabled, recursive = true) {
    if (!node || !cc.sys.isObjectValid(node) || !(node instanceof cc.Node))
        return;

    if (node.setCascadeColorEnabled !== undefined)
        node.setCascadeColorEnabled(colorEnabled);

    if (node.setCascadeOpacityEnabled !== undefined)
        node.setCascadeOpacityEnabled(opacityEnabled);

    if (recursive && node.getChildren !== undefined) {
        node.getChildren().forEach((child) => {
            NodeUtils.setNodeCascade(child, colorEnabled, opacityEnabled, recursive);
        });
    }
};

NodeUtils.setNodeCascadeColor = function (node, enabled, recursive = true) {
    if (!node || !cc.sys.isObjectValid(node) || !(node instanceof cc.Node))
        return;

    if (node.setCascadeColorEnabled !== undefined)
        node.setCascadeColorEnabled(enabled);

    if (recursive && node.getChildren !== undefined) {
        node.getChildren().forEach((child) => {
            NodeUtils.setNodeCascadeColor(child, enabled, recursive);
        });
    }
};

NodeUtils.setNodeCascadeOpacity = function (node, enabled, recursive = true) {
    if (!node || !cc.sys.isObjectValid(node) || !(node instanceof cc.Node))
        return;

    if (node.setCascadeOpacityEnabled !== undefined)
        node.setCascadeOpacityEnabled(enabled);

    if (recursive && node.getChildren !== undefined) {
        node.getChildren().forEach((child) => {
            NodeUtils.setNodeCascadeOpacity(child, enabled, recursive);
        });
    }
};

NodeUtils.findChildByName = function (root, name) {

    if (!root)
        return null;

    if (root.getName() === name)
        return root;

    let children = root.getChildren();
    let length = children.length;
    for (let i = 0; i < length; i++) {
        let child = children[i];
        let res = NodeUtils.findChildByName(child, name);
        if (res !== null)
            return res;
    }

    return null;
};

NodeUtils.findChildByPath = function (root, path) {

    if (!root)
        return null;

    let node = root;
    let paths = path.split('/');
    for (let i = 0; i < paths.length; i++) {
        node = node.getChildByName(paths[i]);
        if (!node)
            return null;
    }

    return ((node === root) ? null : node);
};

NodeUtils.showFlyText = function (parent, zorder, message, styles, position, height, time = 1.0, delay = 0) {

    let fontName = styles.fontName || "";
    let fontSize = styles.fontSize || 0;

    let textColor = styles.textColor || cc.color.WHITE;

    let outlineWidth = styles.outlineWidth || 0;
    let outlineColor = styles.outlineColor || cc.color.WHITE;

    let shadowSize = styles.shadowSize || cc.size(0, 0);
    let shadowColor = styles.shadowColor || cc.color.WHITE;

    let text = new ccui.Text(message, fontName, fontSize);
    parent.addChild(text, zorder);

    text.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    text.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
    text.setAnchorPoint(cc.ANCHOR_CENTER());
    text.setTextColor(textColor);

    if (outlineWidth > 0)
        text.enableOutline(outlineColor, outlineWidth);

    if (shadowSize.x !== 0 || shadowSize.y !== 0)
        text.enableShadow(shadowColor, shadowSize);

    let effectTime = (time <= 0) ? 1.0 : time;

    let appear = cc.spawn(cc.fadeIn(0.2 * effectTime), new cc.EaseSineOut(cc.scaleTo(0.2 * effectTime, 1.0)), new cc.EaseSineOut(cc.moveTo(0.2 * effectTime, position.x, position.y + height * 0.5)));
    let disappear = cc.spawn(cc.fadeOut(0.2 * effectTime), new cc.EaseSineOut(cc.moveBy(0.2 * effectTime, 0, height * 0.5)));
    let flow = cc.moveBy(0.5 * effectTime, 0, height);

    text.setOpacity(0);
    text.setScale(0.3);
    text.setPosition(position);
    text.runAction(cc.sequence(cc.delayTime(delay), appear, flow, disappear, cc.removeSelf()));
};

NodeUtils.showToast = function (parent, message, position = cc.visibleRect.center, zorder = 999, padding = cc.size(30, 20), scale = 1, height = 30, time = 5, delay = 0) {

    if (parent === null)
        parent = cc.director.getRunningScene();

    let oldToast = parent.getChildByName("toast");
    if (oldToast && cc.sys.isObjectValid(oldToast)) {
        return;
    }

    let root = ccs.loadWithVisibleSize("res/toast.json");
    root.node.setName("toast");

    parent.addChild(root.node, zorder);

    let text = root.node.getChildByName("text");
    text.setString(message);
    text.setFontSize(text.getFontSize() * 1.3);
    NodeUtils.fixTextLayout(text);

    let panel = root.node.getChildByName("panel");
    panel.setContentSize(cc.size(text.getContentSize().width + padding.width * 2, text.getContentSize().height + padding.height * 2));

    panel.setScale(scale);
    text.setScale(scale);

    let effectTime = 0.25;
    let show = cc.sequence(cc.spawn(cc.fadeIn(effectTime * 0.7), new cc.EaseSineOut(cc.moveTo(effectTime, position.x, position.y))));
    let hide = cc.sequence(cc.spawn(cc.fadeOut(effectTime * 0.7), new cc.EaseSineOut(cc.moveTo(effectTime, position.x, position.y + height))), cc.hide());

    root.node.setVisible(false);
    root.node.setOpacity(0);
    root.node.setPosition(cc.p(position.x, position.y - height));
    root.node.runAction(cc.sequence(cc.delayTime(delay), cc.show(), show, cc.delayTime(time), hide, cc.removeSelf()));
};

NodeUtils.showFastToast = function (parent, message, position = cc.visibleRect.center, zorder = 999, padding = cc.size(30, 20), scale = 1, height = 30, delay = 0) {
    NodeUtils.showToast(parent, message, position, zorder, padding, scale, height, 1, delay);
};