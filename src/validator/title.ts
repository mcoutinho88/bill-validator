import { convertStringToNumber, prepareAmountValue } from '../utils';
import { addDays, format } from 'date-fns';
import AppError from '../errors/AppError';

const VALIDATOR_DIGIT_ONE_IDX = 9;
const VALIDATOR_DIGIT_TWO_IDX = 20;
const VALIDATOR_DIGIT_THREE_IDX = 31;

export default class TitleValidator {
  payload: string;
  fields: { one: string, two: string, three: string, four: string, five: string };
  DV1: number; // digit validator
  DV2: number;
  DV3: number;
  SD: number;  // security digit

  constructor(payload: string) {
    this.payload = payload;
    this.fields = this._splitIntoFields();
    
    const { DV1, DV2, DV3 } = this._calculateDV();
    this.DV1 = DV1;
    this.DV2 = DV2;
    this.DV3 = DV3;
    this.SD = this._calculateBarCodeSecurityDigit();

    this.validate()
  }

  private _splitIntoFields() {
    return {
      one: this.payload.slice(0, 10),
      two: this.payload.slice(10, 21),
      three: this.payload.slice(21, 32),
      four: this.payload.slice(32, 33),
      five: this.payload.slice(33),
    }
  }

  private validate() {
    if (!this._validateLength()) {
      throw new AppError("Título deverá conter 47 caractéres");
    }

    if (!this._validateDV() || !this._validateSD()) {
      throw new AppError('Boleto inválido');
    }
  }

  private _validateDV() {
    return Number(this.fields.one.slice(-1)) === this.DV1
      && Number(this.fields.two.slice(-1)) === this.DV2
      && Number(this.fields.three.slice(-1)) === this.DV3;
  }

  private _validateSD() {
    return Number(this.fields.four) === this.SD;
  }

  private _calculateDV() {
    const payloadDigits = convertStringToNumber(this.payload);
    const RESET_PREVIOUS_VALUE = 0;
    let DV1 = -1, DV2 = -1, DV3 = -1;

    // variable that dictates whether we should invert the
    // multiplier 2 -> 1 or 1 -> 2 based in the field section
    // e.g. field section 1 starts [2, 1, 2, 1, ...], where as
    // field section 2 starts [1, 2, 1, 2]
    let invert = 0;
  
    payloadDigits.reduce((totalValue, value, idx) => {
      const multiplier = (idx + invert) % 2 === 0 ? 2 : 1;
      const multipliedValue = (value * multiplier);
      const addToTotalValue = multipliedValue < 10
        ? multipliedValue
        : convertStringToNumber(String(multipliedValue))          
          .reduce((prev, curr) => prev + curr, 0);

      if (idx === VALIDATOR_DIGIT_ONE_IDX) {
        DV1 = this._prepareDigitValueResult(totalValue);
        invert = 1;
        return RESET_PREVIOUS_VALUE;
      }
      if (idx === VALIDATOR_DIGIT_TWO_IDX) {
        DV2 = this._prepareDigitValueResult(totalValue);
        invert = 0;
        return RESET_PREVIOUS_VALUE;
      }
      if (idx === VALIDATOR_DIGIT_THREE_IDX) {
        DV3 = this._prepareDigitValueResult(totalValue);
        return RESET_PREVIOUS_VALUE;
      }

      return totalValue + addToTotalValue;
    }, RESET_PREVIOUS_VALUE);
    
    return { DV1, DV2, DV3 };
  }

  private _validateLength() {
    return this.payload.length === 47;
  }

  private _prepareDigitValueResult(totalValue: number) {
    return 10 - totalValue % 10;
  }

  private _getExpirationFactor() {
    const expirationFactor = this.fields.five.slice(0, 4);
    return Number(expirationFactor);
  }

  getExpirationDate() {
    const expirationFactor = this._getExpirationFactor();
    const BASE_DATE = new Date(1997, 9, 7);

    const expirationDate = addDays(BASE_DATE, expirationFactor);
    return format(expirationDate, 'yyyy-MM-dd');
  }

  private _getAmountField() {
    return this.fields.five.slice(4);
  }

  getAmountValue() {
    const amountFields = this._getAmountField();
    
    return prepareAmountValue(amountFields);
  }

  private _getBankCode() {
    return this.payload.slice(0,4);
  }

  private _calculateBarCodeSecurityDigit() {
    const numberToBePrepared = this._mountBarCodeWithoutSecurityDigit().replace('X', "");
    const digitNumbers = convertStringToNumber(numberToBePrepared).reverse();

    const securityDigitTotal = digitNumbers.reduce((totalValue, value, index) => {
      const weight = (index % 8) + 2;
      return totalValue + (value * weight);
    }, 0);

    return 11 - (securityDigitTotal % 11);
  }

  private _mountTitleNumber() {
    return this.fields.one.slice(4, 9)
      + this.fields.two.slice(0, 10)
      + this.fields.three.slice(0, 10);
  }
  
  private _mountBarCodeWithoutSecurityDigit() {
    return this._getBankCode()
      + 'X'
      + this._getExpirationFactor()
      + this._getAmountField()
      + this._mountTitleNumber();
  }

  generateBarCode() {
    return this._mountBarCodeWithoutSecurityDigit().replace('X', `${this.SD}`);
  }
}

