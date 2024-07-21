import CryptoJS from "crypto-js";

export const utilsFunctions = {
  getPagination,
  hashStringWithKey,
  checkForEmptyValues,
  getRandomIntInclusive,
};

function getPagination(page: any, limit: any, array: any[]) {
  if (!page || !limit || isNaN(Number(page)) || isNaN(Number(limit))) {
    throw new Error(
      "Invalid page or limit parameters. Please provide numbers."
    );
  }
  const startIndex = (+page - 1) * +limit;
  const endIndex = startIndex + +limit;
  const slicedArray = array.slice(startIndex, endIndex);
  const res = { rows: slicedArray, amount: array.length };
  return res;
}

function hashStringWithKey(string: string) {
  const hashed = CryptoJS.HmacSHA256(
    string,
    process.env.PASSWORD_HASH_KEY as string
  );
  return hashed.toString(CryptoJS.enc.Hex);
}

function checkForEmptyValues(obj: any): { isValid: boolean; key?: string } {
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === "") {
      return { isValid: false, key: key };
    }
  }
  return { isValid: true };
}

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
