"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var validator_1 = require("./validator");
var app = (0, express_1.default)();
app.get('/ping', function (req, res) { return res.json({ message: "pong" }); });
app.get('/boleto/:payload', function (req, res) {
    var payload = req.params.payload;
    var payloadValidator = new validator_1.TitleValidator(payload);
    var splittedFields = payloadValidator.fields;
    var expirationDate = payloadValidator.getExpirationDate();
    var amount = payloadValidator.getAmountValue();
    var securityDigit = payloadValidator.generateBarCode();
    // if (!isValid) {
    //   return res.status(400).json({ message: 'Titulo invalido'});
    // }
    var parsedFields = '21290.00119 21100.012109 04475.617405 9 75870000002000';
    var barCode = '21299758700000020000001121100012100447561740';
    var boletoObj = {
        securityDigit: securityDigit,
        splittedFields: splittedFields,
        parsedFields: parsedFields,
        barCode: barCode,
        amount: amount,
        expirationDate: expirationDate,
    };
    return res.json(boletoObj);
});
var PORT = 3000;
app.listen(PORT, function () { return console.log("Server listening on port " + PORT); });
//# sourceMappingURL=server.js.map