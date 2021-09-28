import { expect } from 'chai';
import * as sinon from 'ts-sinon';
import TitleValidator from '../../src/validator/title';

describe('TitleValidator', () => {
  let payload: string;
  let titleValidator: TitleValidator;

  beforeEach(() => {
    payload = '21290001192110001210904475617405975870000002000';
    titleValidator = new TitleValidator(payload);
  })

  it('should validate payload length', () => {
    expect(payload).to.have.length(47);
  });

  it('should calculate security digits correctly', () => {
    const { DV1, DV2, DV3 } = titleValidator;

    expect(DV1).to.be.equal(9);
    expect(DV2).to.be.equal(9);
    expect(DV3).to.be.equal(5);
  });

  it('should calculate the expiration date correctly', () => {
    const expirationDate = titleValidator.getExpirationDate();

    expect(expirationDate).to.be.equal('2018-07-16');
  });

  it('should return the amount value correctly', () => {
    const value = titleValidator.getAmountValue();

    expect(value).to.be.equal('20.00');
  });

  it('should calculate the security digit correctly' , () => {
    const securityDigit = titleValidator.SD;

    expect(securityDigit).to.be.equal(9);
  });

  it('should generate the bar code correctly', () => {
    const value = titleValidator.generateBarCode();
    const expectedResult = '21299758700000020000001121100012100447561740';

    expect(value).to.be.equal(expectedResult);
  });
})