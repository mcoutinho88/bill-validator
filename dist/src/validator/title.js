"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var date_fns_1 = require("date-fns");
var VALIDATOR_DIGIT_ONE_IDX = 9;
var VALIDATOR_DIGIT_TWO_IDX = 20;
var VALIDATOR_DIGIT_THREE_IDX = 31;
var TitleValidator = /** @class */ (function () {
    function TitleValidator(payload) {
        this.payload = payload;
        this.fields = this._splitIntoFields();
        var _a = this._calculateDV(), DV1 = _a.DV1, DV2 = _a.DV2, DV3 = _a.DV3;
        this.DV1 = DV1;
        this.DV2 = DV2;
        this.DV3 = DV3;
        this.SD = this._calculateBarCodeSecurityDigit();
    }
    TitleValidator.prototype._splitIntoFields = function () {
        return {
            one: this.payload.slice(0, 10),
            two: this.payload.slice(10, 21),
            three: this.payload.slice(21, 32),
            four: this.payload.slice(32, 33),
            five: this.payload.slice(33),
        };
    };
    TitleValidator.prototype.validate = function () {
        return this._validateLength()
            && this._validateDV();
    };
    TitleValidator.prototype._validateDV = function () {
        return Number(this.fields.one.slice(-1)) === this.DV1
            && Number(this.fields.two.slice(-1)) === this.DV2
            && Number(this.fields.three.slice(-1)) === this.DV3;
    };
    TitleValidator.prototype._calculateDV = function () {
        var _this = this;
        var payloadDigits = (0, utils_1.convertStringToNumber)(this.payload);
        var RESET_PREVIOUS_VALUE = 0;
        var DV1 = -1, DV2 = -1, DV3 = -1;
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
    TitleValidator.prototype._validateLength = function () {
        return this.payload.length === 47;
    };
    TitleValidator.prototype._prepareDigitValueResult = function (totalValue) {
        return 10 - totalValue % 10;
    };
    TitleValidator.prototype._getExpirationFactor = function () {
        var expirationFactor = this.fields.five.slice(0, 4);
        return Number(expirationFactor);
    };
    TitleValidator.prototype.getExpirationDate = function () {
        var expirationFactor = this._getExpirationFactor();
        var BASE_DATE = new Date(1997, 9, 7);
        var expirationDate = (0, date_fns_1.addDays)(BASE_DATE, expirationFactor);
        return (0, date_fns_1.format)(expirationDate, 'yyyy-MM-dd');
    };
    TitleValidator.prototype._getAmountField = function () {
        return this.fields.five.slice(4);
    };
    TitleValidator.prototype.getAmountValue = function () {
        var amountFields = this._getAmountField();
        return (0, utils_1.prepareAmountValue)(amountFields);
    };
    TitleValidator.prototype._getBankCode = function () {
        return this.payload.slice(0, 4);
    };
    TitleValidator.prototype._calculateBarCodeSecurityDigit = function () {
        var numberToBePrepared = this._mountBarCodeWithoutSecurityDigit().replace('X', "");
        var digitNumbers = (0, utils_1.convertStringToNumber)(numberToBePrepared).reverse();
        var securityDigitTotal = digitNumbers.reduce(function (totalValue, value, index) {
            var weight = (index % 8) + 2;
            return totalValue + (value * weight);
        }, 0);
        return 11 - (securityDigitTotal % 11);
    };
    TitleValidator.prototype._mountTitleNumber = function () {
        return this.fields.one.slice(4, 9)
            + this.fields.two.slice(0, 10)
            + this.fields.three.slice(0, 10);
    };
    TitleValidator.prototype._mountBarCodeWithoutSecurityDigit = function () {
        return this._getBankCode()
            + 'X'
            + this.getExpirationFactor()
            + this._getAmountField()
            + this._mountTitleNumber();
    };
    TitleValidator.prototype.generateBarCode = function () {
        var isValid = this.validate();
        if (!isValid) {
            throw new Error('Código da linha digitável está incorreto');
        }
        return this.calculateBarCodeSecurityDigit();
    };
    return TitleValidator;
}());
exports.default = TitleValidator;
//# sourceMappingURL=title.js.map