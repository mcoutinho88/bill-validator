export default function prepareAmountValue(value: string) {
  const decimalIndex = value.length - 2;
  const amountValue = value.substring(0, decimalIndex) + '.' + value.substring(decimalIndex, value.length);

  return parseFloat(amountValue).toFixed(2);
}
