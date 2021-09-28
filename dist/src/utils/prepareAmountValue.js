"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function prepareAmountValue(value) {
    var decimalIndex = value.length - 2;
    var amountValue = value.substring(0, decimalIndex) + '.' + value.substring(decimalIndex, value.length);
    return parseFloat(amountValue).toFixed(2);
}
exports.default = prepareAmountValue;
//# sourceMappingURL=prepareAmountValue.js.map