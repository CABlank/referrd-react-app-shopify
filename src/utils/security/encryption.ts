import Cryptr from "cryptr";

console.log(`ENCRYPTION_STRING: ${process.env.ENCRYPTION_STRING}`);

const encryptionString = process.env.ENCRYPTION_STRING;
if (!encryptionString) {
  throw new Error(
    "ENCRYPTION_STRING environment variable is not set or is empty"
  );
}

const cryption = new Cryptr(encryptionString);

export default cryption;
