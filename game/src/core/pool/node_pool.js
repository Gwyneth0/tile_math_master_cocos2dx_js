var NodePoolMode = {
    CONTAINER: 0,               // use a container (node) for all objects, avoid adding/removing node time by time
    STANDALONE: 1               // self-managed allocation/deallocation for node in memory
};

var NodePool = cc.class("NodePool", {

    ctor: function (creator, capacity = 0, expandable = true) {

        this.creator = creator;

        this.capacity = capacity;
        this.baseCapacity = capacity;

        this.expandable = expandable;

        this.isAutoShrink = false;
        this.autoShrinkOffset = 10;

        this.mode = NodePoolMode.CONTAINER;
        this.list = [];
    },

    /**
     * Indicates if the pool if full of capacity
     * @returns {boolean}
     */
    isFull: function () {
        return this.list.length >= this.capacity;
    },

    /**
     * Indicates if pool is empty
     * @returns {boolean}
     */
    isEmpty: function () {
        return this.list.length <= 0;
    },

    getMode: function () {
        return this.mode;
    },

    setMode: function (value) {
        this.mode = value;
    },

    /**
     * Indicates if pool will auto shrink to its original capacity
     * @param value
     * @param offset
     */
    setAutoShrink: function (value, offset) {
        this.isAutoShrink = value;
        if (offset) {
            this.autoShrinkOffset = offset;
        }
    },

    /**
     * Init nodes in pool with original capacity
     */
    init: function () {
        for (let i = 0; i < this.capacity; i++) {
            let entity = (this.creator && cc.isFunction(this.creator)) ? this.creator() : null;
            if (entity) {
                this.push(entity, true);
            }
        }
    },

    /**
     * Total count of nodes in pool
     * @returns {number}
     */
    count: function () {
        return this.list.length;
    },

    /**
     * Total count of nodes are being used
     * @returns {*}
     */
    usedCount: function () {
        return this.list.reduce((total, item) => {
            return total + ((item.isUsed === true) ? 1 : 0)
        }, 0);
    },

    /**
     * Total count of available to used nodes
     * @returns {*}
     */
    leftCount: function () {
        return this.list.reduce((total, item) => {
            return total + ((item.isUsed === true) ? 0 : 1)
        }, 0);
    },

    /**
     * Return a node to pool
     * @param entity
     * @param init
     */
    push: function (entity, init = false) {

        if (!(entity instanceof cc.Node))
            return;

        entity.isUsed = false;
        entity.setVisible(false);

        if (this.mode === NodePoolMode.CONTAINER && entity.owner)
            NodeUtils.switchParent(entity, entity.owner);

        if (init) {

            // get owner when init (container mdoe)
            if (this.mode === NodePoolMode.CONTAINER)
                entity.owner = entity.getParent();
            else
                entity.retain();

            this.list.push(entity);
            
        } else if (this.isAutoShrink && this.list.length > this.baseCapacity + this.autoShrinkOffset && this.leftCount() > this.autoShrinkOffset) {
            // only shrink when push node after use
            this.shrinkBy(this.autoShrinkOffset);
        }
    },

    /**
     * Get a free node from pool
     * @returns {null|*}
     */
    pull: function () {

        for (let i = 0; i < this.list.length; i++) {
            let entity = this.list[i];
            if (entity.isUsed === false) {
                entity.isUsed = true;
                return entity;
            }
        }

        if (!this.isFull() || this.expandable) {

            let entity = (this.creator && cc.isFunction(this.creator)) ? this.creator() : null;
            if (entity) {
                this.push(entity, true);
                if (this.isFull())
                    this.capacity++;
            }

            entity.isUsed = true;
            return entity;
        }

        cc.log(this.LOGTAG, "pull", "No entity left in pool!");
        return null;
    },

    /**
     * Revoke all nodes in pool
     */
    revoke: function () {
        this.list.forEach((entity) => {
            this.push(entity);
        });
    },

    /**
     * Release a number of un-used nodes in pool
     * @param count Count of nodes to remove
     * @returns {number} Return actual removed nodes count
     */
    shrinkBy: function (count) {

        let index = 0;
        let entity = null;
        let removeCount = Math.min(this.list.length, count);
        while (index < this.list.length && removeCount > 0) {
            entity = this.list[index];
            if (entity.isUsed === false) {
                this.list.splice(index, 1);
                this.removeEntity(entity, this.mode === NodePoolMode.STANDALONE);
                removeCount--;
                continue;
            }
            index++;
        }

        this.capacity = this.list.length;
        return count - removeCount;
    },

    /**
     * Compact pool to target capacity by releasing un-used nodes
     * @param count Target size of pool
     * @returns {number} Actual size of pool after shrinking
     */
    shrinkTo: function (count) {

        if (count <= 0 || count >= this.list.length)
            return this.list.length;

        let index = 0;
        let entity = null;
        while (index < this.list.length && this.list.length > count) {
            entity = this.list[index];
            if (entity.isUsed === false) {
                this.list.splice(index, 1);
                this.removeEntity(entity, this.mode === NodePoolMode.STANDALONE);
                continue;
            }
            index++;
        }

        this.capacity = this.list.length;
        return this.list.length;
    },

    /**
     * Compact pool to its original capacity
     * @returns {number} Actual size of pool after shrinking
     */
    shrinkToBase: function () {
        return this.shrinkTo(this.baseCapacity);
    },

    /**
     * Remove entity from parent with cleanup
     * @param entity
     * @param release
     */
    removeEntity: function (entity, release = false) {
        if (entity.getParent() !== null)
            entity.removeFromParent();
        if (release)
            entity.release();
    },

    /**
     * Release all nodes in pool from memory (used in STANDALONE mode)
     */
    clear: function () {
        this.list.forEach((entity) => entity.release());
        this.list.splice(0, this.list.length);
    }
});