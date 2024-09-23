var StringUtils = StringUtils || {};

StringUtils.formatNumber = function (value, digits) {
    if (digits === 2)
        return ((value > 9 ? "" : "0") + value);
    else if (digits === 3)
        return ((value > 99 ? "" : (value > 9 ? "0" : "00")) + value);
    let result = "" + value;
    while (result.length < digits)
        result = "0" + result;
    return result;
};

StringUtils.formatNumberDelimiter = function (number, delimiter = '.') {
    return ('' + number).replace(/(\d)(?=(?:\d{3})+(?:\.|$))|(\.\d\d?)\d*$/g, function (m, lhs, rhs) {
        return rhs || (lhs + delimiter);
    });
};

StringUtils.breakline = function (value) {
    return value.replace("\\n", '\n');
};

StringUtils.shorten = function (str, maxLength = 13, cutLength = 5, replacement = '...') {
    if (str.length > maxLength)
        return str.substring(0, cutLength) + replacement + str.substring(str.length - cutLength, str.length);
    return str;
};

/**
 * Chuyển mảng bytes thành chuỗi
 * @param buffer {ArrayBuffer}
 * @returns {String}
 */
StringUtils.bufferToString = function (buffer) {
    return Array.prototype.reduce.call(new Uint8Array(buffer), (result, value) => {
        return result + String.fromCharCode(value);
    }, "");
};

/**
 * Chuyển chuỗi thành mảng bytes (array buffer)
 * @param str {String}
 * @returns {ArrayBuffer}
 */
StringUtils.stringToBuffer = function (str) {
    let buffer = new ArrayBuffer(str.length * 2);
    let bufferView = new DataView(buffer);
    for (let i = 0; i < str.length; i++) {
        bufferView.setUint16(i * 2, str.charCodeAt(i));
    }
    return buffer;
};

/**
 * In buffer ra chuỗi thập phân
 * @param buffer
 * @returns {string}
 */
StringUtils.bufferToDec = function (buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => x.toString()).join(' ');
};

/**
 * In buffer ra chuỗi nhị phân
 * @param buffer
 * @returns {string}
 */
StringUtils.bufferToByte = function (buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(2)).slice(-2)).join(' ');
};

/**
 * In buffer ra chuỗi hex
 * @param buffer
 * @returns {string}
 */
StringUtils.bufferToHex = function (buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join(' ');
};