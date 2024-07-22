import Cryptr from "cryptr";

const encryptionString = process.env.ENCRYPTION_STRING;
if (!encryptionString) {
  throw new Error(
    "ENCRYPTION_STRING environment variable is not set or is empty"
  );
}

export const cryption = new Cryptr(encryptionString);

export const encrypt = (text: string) => {
  return cryption.encrypt(text);
};

export const decrypt = (hash: string) => {
  return cryption.decrypt(hash);
};
