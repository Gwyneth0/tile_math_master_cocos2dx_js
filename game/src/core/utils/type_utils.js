var TypeUtils = TypeUtils || {};

TypeUtils.isNullOrEmpty = function (value) {
    return (value === undefined || value == null || value === '');
};

TypeUtils.bufferToBase64 = function (buffer) {

    const encodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    let t = "";
    let n, r, i, s, o, u, a;
    let f = 0;

    while (f < buffer.length) {

        n = buffer[f++];
        r = buffer[f++];
        i = buffer[f++];

        s = n >> 2;
        o = (n & 3) << 4 | r >> 4;
        u = (r & 15) << 2 | i >> 6;
        a = i & 63;

        if (isNaN(r))
            u = a = 64;
        else if (isNaN(i))
            a = 64;

        t = t + encodeChars.charAt(s) + encodeChars.charAt(o) + encodeChars.charAt(u) + encodeChars.charAt(a);
    }

    return t;
};