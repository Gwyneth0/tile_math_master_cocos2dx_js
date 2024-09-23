var MathUtils = MathUtils || {};

MathUtils.round = function (value, digit) {
    let factor = 1;
    for (let i = 0; i < digit; i++)
        factor *= 10;
    return Math.floor(value * factor) / factor;
};

MathUtils.randomMax = function (max) {
    return MathUtils.randomMinMax(0, Math.max(max - 1));
};

MathUtils.randomMinMax = function (min, max) {
    min = Math.min(min, max);
    max = Math.max(max, min);
    return min + Math.round(Math.random() * (max - min));
};