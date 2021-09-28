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
    var splittedFields = payloadValidator.splitIntoFields();
    var _a = payloadValidator.calculateDV(), DV1 = _a.DV1, DV2 = _a.DV2, DV3 = _a.DV3;
    var expirationDate = payloadValidator.calculateExpirationDate();
    // if (!isValid) {
    //   return res.status(400).json({ message: 'Titulo invalido'});
    // }
    var parsedFields = '21290.00119 21100.012109 04475.617405 9 75870000002000';
    var barCode = '21299758700000020000001121100012100447561740';
    var boletoObj = {
        splittedFields: splittedFields,
        parsedFields: parsedFields,
        barCode: barCode,
        amount: 20.00,
        c: payload.slice(9, 10),
        DV1: DV1,
        cccc: payload.slice(4, 9),
        cBar: barCode.slice(19, 24),
        DV2: DV2,
        d: payload.slice(20, 21),
        dddd: payload.slice(10, 20),
        dBar: barCode.slice(24, 34),
        DV3: DV3,
        e: payload.slice(31, 32),
        eeee: payload.slice(21, 31),
        eBar: barCode.slice(34),
        expirationDate: expirationDate,
    };
    return res.json(boletoObj);
});
var PORT = 3000;
app.listen(PORT, function () { return console.log("Server listening on port " + PORT); });
//# sourceMappingURL=server.js.map