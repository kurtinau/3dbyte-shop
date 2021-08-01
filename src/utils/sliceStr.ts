type addressType = {
  line1?: string;
  line2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
};

const sliceAddress = (str: string) => {
  if (str) {
    const lastIndexComma = str.lastIndexOf(",");
    const addresslines = str.slice(0, lastIndexComma).trim();
    const restAddress = str.slice(lastIndexComma + 1).trim();
    let re = /,/g;
    const addressLinesArray = re[Symbol.split](addresslines);
    re = /\s/g;
    const suburbStatePostcodeArray = re[Symbol.split](restAddress);
    const addressResult: addressType | null = {};
    if (addressLinesArray) {
      switch (addressLinesArray.length) {
        case 1:
          addressResult.line1 = addressLinesArray[0].trim();
          break;
        case 2:
          addressResult.line1 = addressLinesArray[0].trim();
          addressResult.line2 = addressLinesArray[1].trim();
          break;
        default:
          addressResult.line1 =
            addressLinesArray[0].trim() + ", " + addressLinesArray[1].trim();
          addressResult.line2 = addressLinesArray[2].trim();
          break;
      }
    }
    if (suburbStatePostcodeArray) {
      addressResult.postcode =
        suburbStatePostcodeArray[suburbStatePostcodeArray.length - 1];
      addressResult.state =
        suburbStatePostcodeArray[suburbStatePostcodeArray.length - 2];
      let suburbStr = "";
      for (let i = 0; i < suburbStatePostcodeArray.length - 2; i++) {
        suburbStr = suburbStr + suburbStatePostcodeArray[i] + " ";
      }
      addressResult.suburb = suburbStr.trim();
    }
    return addressResult;
  }
  return null;
};

export { sliceAddress };
