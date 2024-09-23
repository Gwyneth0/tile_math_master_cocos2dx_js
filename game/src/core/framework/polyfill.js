// Support read/write bool, big int 64 for DataView

var DataView = DataView || {};

DataView.prototype.getBool = function (byteOffset) {
    return (this.getInt8(byteOffset) !== 0);
};

DataView.prototype.setBool = function (byteOffset, value) {
    this.setInt8(byteOffset, (value === true) ? 1 : 0);
};

DataView.prototype.getBigInt64 = function (byteOffset, littleEndian) {
    let x = this.getInt32(byteOffset, littleEndian);
    let y = this.getInt32(byteOffset + 4, littleEndian);
    
    if (littleEndian) {
        return x + y * 0x80000000;
    }
    else {
        return x * 0x80000000 + y;
    }
    
    // // return (this.getInt32(byteOffset, littleEndian) << 4) + this.getInt32(byteOffset + 4, littleEndian);
    // // // TODO: Handle for big indian

    // if (littleEndian)
    //     return (this.getUint32(byteOffset + 4, littleEndian) << 32) | this.getUint32(byteOffset, littleEndian);
    // else
    //     return (this.getUint32(byteOffset, littleEndian) << 32) | this.getUint32(byteOffset + 4, littleEndian);
};

DataView.prototype.setBigInt64 = function (byteOffset, value, littleEndian) {

    // this.setUint32(byteOffset, value >> 32, littleEndian); // write the high order bits
    // this.setUint32(byteOffset + 4, value & 0x00ff, littleEndian); // write the low order bits
    // // TODO: Handle for big indian
    
    let lo = value % 0x80000000;
    let hi = ((value < 0 ? -value : value) / 0x80000000) | 0;

    this.setInt32(byteOffset + (littleEndian ? 0 : 4), lo, littleEndian);
    this.setInt32(byteOffset + (littleEndian ? 4 : 0), hi, littleEndian);
};

DataView.prototype.getBigUint64 = function (byteOffset, littleEndian) {
    let x = this.getUint32(byteOffset, littleEndian);
    let y = this.getUint32(byteOffset + 4, littleEndian);
    
    if (littleEndian) {
        return x + y * 0x80000000;
    }
    else {
        return x * 0x80000000 + y;
    }

    // return (this.getInt32(byteOffset, littleEndian) << 4) + this.getInt32(byteOffset + 4, littleEndian);
    // // TODO: Handle for big indian

    // if (littleEndian)
    //     return (this.getUint32(byteOffset + 4, littleEndian) << 32) | this.getUint32(byteOffset, littleEndian);
    // else
    //     return (this.getUint32(byteOffset, littleEndian) << 32) | this.getUint32(byteOffset + 4, littleEndian);
};

DataView.prototype.setBigUint64 = function (byteOffset, value, littleEndian) {

    // this.setUint32(byteOffset, value >> 32, littleEndian); // write the high order bits
    // this.setUint32(byteOffset + 4, value & 0x00ff, littleEndian); // write the low order bits
    // // TODO: Handle for big indian
    
    let lo = (value < 0 ? -value : value) % 0x80000000;
    let hi = ((value < 0 ? -value : value) / 0x80000000) | 0;

    this.setUint32(byteOffset + (littleEndian ? 0 : 4), lo, littleEndian);
    this.setUint32(byteOffset + (littleEndian ? 4 : 0), hi, littleEndian);
};

// Support bytes to string for ArrayBuffer

var ArrayBuffer = ArrayBuffer || {};

ArrayBuffer.prototype.toString = function (type) {
    if (type === 2) {
        return this.toByteString();
    } else if (type === 16) {
        return this.toHexString();
    }
    return this.toDecString();
};

ArrayBuffer.prototype.toHexString = function () {
    return (new Uint8Array(this)).toHexString();
};

ArrayBuffer.prototype.toDecString = function () {
    return (new Uint8Array(this)).toDecString();
};

ArrayBuffer.prototype.toByteString = function () {
    return (new Uint8Array(this)).toByteString();
};

// Support bytes to string for Uint8Array

var Uint8Array = Uint8Array || {};

Uint8Array.prototype.set = function (bytes, offset) {
    for (let i = offset; i < this.length; i++)
        this[i] = bytes[i - offset];
};

Uint8Array.prototype.fill = function (value, start, end) {
    Array.prototype.fill.call(value, start, end);
};

Uint8Array.prototype.toString = function (type) {
    if (type === 2) {
        return this.toByteString();
    } else if (type === 16) {
        return this.toHexString();
    }
    return this.toDecString();
};

Uint8Array.prototype.toHexString = function () {
    return Array.prototype.map.call(this, x => ('00' + x.toString(16)).slice(-2)).join(' ');
};

Uint8Array.prototype.toDecString = function () {
    return Array.prototype.map.call(this, x => x.toString()).join(' ');
};

Uint8Array.prototype.toByteString = function () {
    return Array.prototype.map.call(this, x => ('00' + x.toString(2)).slice(-2)).join(' ');
};

// Support cyclic object stringify

if (!JSON.circular) {

    JSON._stringify = JSON.stringify;
    JSON.stringify = function (value, replacer = null, space = null) {

        const circularReplacer = () => {
            const cache = [];
            return (key, value) => {
                if (typeof value === "object" && value !== null) {
                    if (cache.indexOf(value) >= 0)
                        return '[circular]';
                    cache.push(value);
                }
                return value;
            };
        };

        return JSON._stringify(value, circularReplacer());
    };

    JSON.circular = true;
}