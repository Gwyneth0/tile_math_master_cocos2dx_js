var GPSPay;

if (cc.sys.isNative) {
    GPSPay = GPSPayment.getInstance();
}
else {
    GPSPay = {

        purchase: () => {},
        syncPurchases: () => {},
        
        addOneTimeProduct: () => {},
        clearOneTimeProduct: () => {},

        getVerifiedPurchases: () => {},
        deleteVerifiedPurchase: () => {},

        consumeAllPurchases: () => {},
        consumeAllVerifiedPurchases: () => {},

        isProductPurchased: () => false,
        
        listenPurchaseSynced: () => {},
        listenPurchaseFailed: () => {},
        listenPurchaseQueued: () => {},
        listenPurchaseVerify: () => {},
    };
}

Object.defineProperties(GPSPay, {

    onPurchaseSynced: {
        get: function () {
            return undefined;
        },
        set: function (value) {
            this.listenPurchaseSynced(value);
        }
    },

    onPurchaseFailed: {
        get: function () {
            return undefined;
        },
        set: function (value) {
            this.listenPurchaseFailed(value);
        }
    },

    onPurchaseQueued: {
        get: function () {
            return undefined;
        },
        set: function (value) {
            this.listenPurchaseQueued(value);
        }
    },

    onPurchaseVerify: {
        get: function () {
            return undefined;
        },
        set: function (value) {
            this.listenPurchaseVerify(value);
        }
    },
});

/**
 * @returns {object}
 */
GPSPay.getAllVerifiedPurchases = function () {

    let data = [];

    try {
        let json = GPSPay.getVerifiedPurchases();
        data = JSON.parse(json);
        data = data.purchases || [];
    } catch (error) {}

    return data;
};