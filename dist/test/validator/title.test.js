"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var title_1 = __importDefault(require("../../src/validator/title"));
describe('TitleValidator', function () {
    var payload;
    var titleValidator;
    beforeEach(function () {
        payload = '21290001192110001210904475617405975870000002000';
        titleValidator = new title_1.default(payload);
    });
    it('should validate payload length', function () {
        (0, chai_1.expect)(payload).to.have.length(47);
    });
    it('should calculate security digits correctly', function () {
        var DV1 = titleValidator.DV1, DV2 = titleValidator.DV2, DV3 = titleValidator.DV3;
        (0, chai_1.expect)(DV1).to.be.equal(9);
        (0, chai_1.expect)(DV2).to.be.equal(9);
        (0, chai_1.expect)(DV3).to.be.equal(5);
    });
    it('should calculate the expiration date correctly', function () {
        var expirationDate = titleValidator.getExpirationDate();
        (0, chai_1.expect)(expirationDate).to.be.equal('2018-07-16');
    });
    it('should return the amount value correctly', function () {
        var value = titleValidator.getAmountValue();
        (0, chai_1.expect)(value).to.be.equal('20.00');
    });
    it('TEMP should prepare the number correctly', function () {
        var value = titleValidator._mountBarCodeWithoutSecurityDigit();
        var expectedResult = '2129X758700000020000001121100012100447561740';
        (0, chai_1.expect)(value).to.be.equal(expectedResult);
    });
    it('should calculate the security digit correctly', function () {
        var securityDigit = titleValidator._calculateBarCodeSecurityDigit();
        (0, chai_1.expect)(securityDigit).to.be.equal(9);
    });
});
//# sourceMappingURL=title.test.js.map