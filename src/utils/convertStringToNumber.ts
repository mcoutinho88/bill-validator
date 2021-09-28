export default function convertStringToNumber(value: string) {
  return value.split("").map((strToNumber) => Number(strToNumber));
}