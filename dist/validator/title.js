"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var date_fns_1 = require("date-fns");
var VALIDATOR_DIGIT_ONE_IDX = 9;
var VALIDATOR_DIGIT_TWO_IDX = 20;
var VALIDATOR_DIGIT_THREE_IDX = 31;
var TitleValidator = /** @class */ (function () {
    // fields: { one: number, two: number, three: number, four: number, five: number };
    function TitleValidator(payload) {
        this.payload = payload;
    }
    TitleValidator.prototype.validate = function () {
        if (!this.validateLength()) {
            return false;
        }
        return this.splitIntoFields();
    };
    TitleValidator.prototype.splitIntoFields = function () {
        return {
            one: this.payload.slice(0, 10),
            two: this.payload.slice(10, 21),
            three: this.payload.slice(21, 32),
            four: this.payload.slice(32, 33),
            five: this.payload.slice(33),
        };
    };
    TitleValidator.prototype.calculateDV = function () {
        var _this = this;
        var payloadDigits = (0, utils_1.convertStringToNumber)(this.payload);
        var RESET_PREVIOUS_VALUE = 0;
        var DV1, DV2, DV3;
        // variable that dictates whether we should invert the
        // multiplier 2 -> 1 and 1 -> 2 based in the field section
        var invert = 0;
        payloadDigits.reduce(function (totalValue, value, idx) {
            var multiplier = (idx + invert) % 2 === 0 ? 2 : 1;
            var multipliedValue = (value * multiplier);
            var addToTotalValue = multipliedValue < 10
                ? multipliedValue
                : (0, utils_1.convertStringToNumber)(String(multipliedValue))
                    .reduce(function (prev, curr) { return prev + curr; }, 0);
            if (idx === VALIDATOR_DIGIT_ONE_IDX) {
                DV1 = _this._prepareDigitValueResult(totalValue);
                invert = 1;
                return RESET_PREVIOUS_VALUE;
            }
            if (idx === VALIDATOR_DIGIT_TWO_IDX) {
                DV2 = _this._prepareDigitValueResult(totalValue);
                invert = 0;
                return RESET_PREVIOUS_VALUE;
            }
            if (idx === VALIDATOR_DIGIT_THREE_IDX) {
                DV3 = _this._prepareDigitValueResult(totalValue);
                return RESET_PREVIOUS_VALUE;
            }
            return totalValue + addToTotalValue;
        }, RESET_PREVIOUS_VALUE);
        return { DV1: DV1, DV2: DV2, DV3: DV3 };
    };
    TitleValidator.prototype.validateLength = function () {
        return this.payload.length === 47;
    };
    TitleValidator.prototype._prepareDigitValueResult = function (totalValue) {
        return 10 - totalValue % 10;
    };
    TitleValidator.prototype.getExpirationFactor = function () {
        var expirationFactor = this.payload.slice(33, 37);
        return Number(expirationFactor);
    };
    TitleValidator.prototype.calculateExpirationDate = function () {
        var expirationFactor = this.getExpirationFactor();
        var BASE_DATE = new Date(1997, 9, 7);
        var expirationDate = (0, date_fns_1.addDays)(BASE_DATE, expirationFactor);
        return (0, date_fns_1.format)(expirationDate, 'yyyy-MM-dd');
    };
    return TitleValidator;
}());
exports.default = TitleValidator;
//# sourceMappingURL=title.js.map